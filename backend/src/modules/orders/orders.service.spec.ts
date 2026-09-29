import { OrdersService } from './orders.service';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DocType, OrderSource, PaymentMethod, Role } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockPrisma: any;
  let mockNubeFact: any;
  let mockEmail: any;
  let mockIzipay: any;

  beforeEach(() => {
    mockPrisma = {
      product: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
      },
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn(),
        update: jest.fn().mockImplementation(({ data, where }: any) => ({
          id: where?.id || 'ord-updated',
          isPaid: true,
          userId: 'patient-100',
          ...data,
        })),
      },
      billingCorrelative: {
        upsert: jest.fn().mockResolvedValue({ series: 'B001', currentNumber: 1 }),
      },
      $queryRaw: jest.fn().mockResolvedValue([]),
      $transaction: jest.fn((callback) => callback(mockPrisma)),
    };

    mockNubeFact = {
      generateDocument: jest.fn().mockResolvedValue({
        documentNumber: 'B001-1',
        externalId: 'ext-123',
        pdfUrl: 'https://nubefact.com/ticket.pdf',
        xmlUrl: 'https://nubefact.com/ticket.xml',
      }),
      getNextCorrelative: jest.fn().mockResolvedValue(1),
      consultDocument: jest.fn().mockResolvedValue({ status: 'NOT_FOUND', found: false }),
      generateCreditNote: jest.fn().mockResolvedValue({
        documentNumber: 'BC01-1',
        pdfUrl: 'https://nubefact.com/nc.pdf',
        xmlUrl: 'https://nubefact.com/nc.xml',
      }),
    };

    mockEmail = {
      sendOrderInvoice: jest.fn().mockResolvedValue(true),
    };

    mockIzipay = {
      validatePaymentDetails: jest.fn(),
      verifyPayment: jest.fn(),
    };

    service = new OrdersService(
      mockPrisma,
      mockNubeFact,
      mockEmail,
      mockIzipay,
    );
  });

  describe('SUNAT Billing Validation', () => {
    it('should reject FACTURA if RUC is not 11 digits', async () => {
      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
        documentType: DocType.FACTURA,
        customerDocNumber: '12345', // Invalid: not 11 digits
        customerLegalName: 'Empresa Test',
      };

      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        'RUC válido de 11 dígitos',
      );
    });

    it('should reject FACTURA if RUC has invalid SUNAT check digit', async () => {
      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
        documentType: DocType.FACTURA,
        customerDocNumber: '20601234567', // Check digit is 5, 7 is invalid
        customerLegalName: 'Dra Leyva SAC',
      };

      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        'dígito verificador SUNAT correcto',
      );
    });

    it('should reject FACTURA if Razon Social is empty', async () => {
      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
        documentType: DocType.FACTURA,
        customerDocNumber: '20601234565', // Valid RUC with correct Modulo 11 check digit
        customerLegalName: '   ', // Empty
      };

      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        'Razón Social',
      );
    });
  });

  describe('Stock Validation & Concurrency Protection', () => {
    it('should reject if any product does not exist or is inactive', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);

      const orderDto: any = {
        items: [{ productId: 'p-nonexistent', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
      };

      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should reject if initial stock check fails', async () => {
      mockPrisma.product.findMany.mockResolvedValue([
        {
          id: 'p1',
          name: 'Bloqueador Solar FPS 50+',
          price: 95.0,
          stock: 2,
          isActive: true,
        },
      ]);

      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 5 }], // Demands 5, only 2 available
        paymentMethod: PaymentMethod.CASH,
      };

      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        'Stock insuficiente',
      );
    });

    it('should abort transaction if atomic stock decrement detects race condition', async () => {
      mockPrisma.product.findMany.mockResolvedValue([
        {
          id: 'p1',
          name: 'Crema Hidratante',
          price: 50.0,
          stock: 1,
          isActive: true,
        },
      ]);

      mockPrisma.order.create.mockResolvedValue({
        id: 'ord-123',
        total: 50.0,
      });

      // Simulate concurrent transaction winning the stock first
      mockPrisma.product.updateMany.mockResolvedValue({ count: 0 });

      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
      };

      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(orderDto, 'user-1')).rejects.toThrow(
        'Stock insuficiente o agotado en tiempo real',
      );
    });
  });

  describe('Izipay Web Credit Card Anti-Tampering', () => {
    it('should create pending order (isPaid = false) when initiating web credit card payment before payment gateway', async () => {
      mockPrisma.product.findMany.mockResolvedValue([
        { id: 'p1', name: 'Serum', price: 100.0, stock: 10, isActive: true },
      ]);
      mockPrisma.product.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.order.create.mockResolvedValue({
        id: 'ord-pending-1',
        total: 100.0,
        isPaid: false,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        source: OrderSource.WEB,
      });

      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CREDIT_CARD,
        source: OrderSource.WEB,
      };

      const result = await service.create(orderDto, 'user-1');
      expect(result.isPaid).toBe(false);
    });

    it('should reject confirmPayment if Izipay validation reports amount discrepancy or failure', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'ord-100',
        total: 100.0,
        isPaid: false,
        source: OrderSource.WEB,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        userId: 'user-1',
      });

      mockIzipay.validatePaymentDetails.mockReturnValue({
        valid: false,
        reason: 'Discrepancia en monto pagado (Esperado: 10000, Recibido: 100)',
      });

      await expect(
        service.confirmPayment('ord-100', '{"some":"answer"}', 'mock-hash', {
          userId: 'user-1',
          role: Role.PATIENT,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject confirmPayment without authentication if order belongs to a registered user', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'ord-100',
        total: 100.0,
        isPaid: false,
        source: OrderSource.WEB,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        userId: 'user-1',
      });

      await expect(
        service.confirmPayment('ord-100', '{"some":"answer"}', 'mock-hash', undefined),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject confirmPayment if order is not WEB CREDIT_CARD', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'ord-pos',
        total: 100.0,
        isPaid: false,
        source: OrderSource.POS,
        paymentMethod: PaymentMethod.CASH,
        userId: 'user-1',
      });

      await expect(
        service.confirmPayment('ord-pos', '{"some":"answer"}', 'mock-hash', {
          userId: 'user-1',
          role: Role.PATIENT,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject replay attacks if a transaction with the same paymentReference has already been processed', async () => {
      mockPrisma.order.findUnique
        .mockResolvedValueOnce({
          id: 'ord-100',
          total: 100.0,
          isPaid: false,
          source: OrderSource.WEB,
          paymentMethod: PaymentMethod.CREDIT_CARD,
          userId: 'user-1',
        })
        .mockResolvedValueOnce({
          id: 'ord-previously-processed',
          paymentReference: 'already-used-hash-123',
        });

      mockIzipay.validatePaymentDetails.mockReturnValue({
        valid: true,
        transactionId: 'already-used-hash-123',
      });

      await expect(
        service.confirmPayment('ord-100', '{"some":"answer"}', 'already-used-hash-123', {
          userId: 'user-1',
          role: Role.PATIENT,
        }),
      ).rejects.toThrow('replay attack');
    });

    it('should catch Prisma P2002 race condition and return 400 Bad Request duplicate payment', async () => {
      mockPrisma.order.findUnique
        .mockResolvedValueOnce({
          id: 'ord-100',
          total: 100.0,
          isPaid: false,
          source: OrderSource.WEB,
          paymentMethod: PaymentMethod.CREDIT_CARD,
          userId: 'user-1',
        })
        .mockResolvedValueOnce(null);

      mockIzipay.validatePaymentDetails.mockReturnValue({
        valid: true,
        transactionId: 'concurrent-uuid-999',
      });

      mockPrisma.order.update.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['paymentReference'] },
      });

      await expect(
        service.confirmPayment('ord-100', '{"some":"answer"}', 'concurrent-hash', {
          userId: 'user-1',
          role: Role.PATIENT,
        }),
      ).rejects.toThrow('P2002');
    });
  });

  describe('Role-Based Order Creation & Authorization', () => {
    it('should reject PATIENT attempting to create a POS order', async () => {
      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
        source: OrderSource.POS,
      };

      await expect(
        service.create(orderDto, { userId: 'patient-1', role: Role.PATIENT }),
      ).rejects.toThrow('únicamente pueden generar compras a través del canal WEB');
    });

    it('should reject PATIENT attempting to create order with another patientId', async () => {
      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
        source: OrderSource.WEB,
        patientId: 'victim-id-456',
      };

      await expect(
        service.create(orderDto, { userId: 'patient-1', role: Role.PATIENT }),
      ).rejects.toThrow('no pueden registrar compras a nombre de otros usuarios');
    });

    it('should create WEB order with isPaid=false when PATIENT pays with CASH or TRANSFER', async () => {
      mockPrisma.product.findMany.mockResolvedValue([
        { id: 'p1', name: 'Serum', price: 100.0, stock: 10, isActive: true },
      ]);
      mockPrisma.order.create.mockImplementation(({ data }: any) => ({
        id: 'ord-web-cash',
        ...data,
      }));
      mockPrisma.product.updateMany.mockResolvedValue({ count: 1 });

      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
        source: OrderSource.WEB,
      };

      const result = await service.create(orderDto, { userId: 'patient-1', role: Role.PATIENT });
      expect(result.isPaid).toBe(false);
      // NubeFact document generation should NOT be called for unpaid orders
      expect(mockNubeFact.generateDocument).not.toHaveBeenCalled();
    });

    it('should allow ADMIN/RECEPTION to create POS order with isPaid=true', async () => {
      mockPrisma.product.findMany.mockResolvedValue([
        { id: 'p1', name: 'Serum', price: 100.0, stock: 10, isActive: true },
      ]);
      mockPrisma.order.create.mockImplementation(({ data }: any) => ({
        id: 'ord-pos-cash',
        ...data,
      }));
      mockPrisma.product.updateMany.mockResolvedValue({ count: 1 });

      const orderDto: any = {
        items: [{ productId: 'p1', quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
        source: OrderSource.POS,
        patientId: 'patient-100',
      };

      const result = await service.create(orderDto, { userId: 'admin-1', role: Role.ADMIN });
      expect(result.isPaid).toBe(true);
      expect(result.userId).toBe('patient-100');
    });
  });

  describe('IDOR Security on findOne', () => {
    it('should forbid a PATIENT from viewing another user order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'ord-victim',
        userId: 'victim-user-id',
        items: [],
      });

      await expect(
        service.findOne('ord-victim', 'attacker-user-id', Role.PATIENT),
      ).rejects.toThrow('No tienes permisos');
    });

    it('should forbid a PATIENT from viewing a POS order without userId (null userId)', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'ord-pos-anonymous',
        userId: null,
        items: [],
      });

      await expect(
        service.findOne('ord-pos-anonymous', 'patient-user-id', Role.PATIENT),
      ).rejects.toThrow('No tienes permisos');
    });

    it('should allow a PATIENT to view their own order', async () => {
      const myOrder = {
        id: 'ord-mine',
        userId: 'my-user-id',
        items: [],
      };
      mockPrisma.order.findUnique.mockResolvedValue(myOrder);

      const result = await service.findOne('ord-mine', 'my-user-id', Role.PATIENT);
      expect(result).toBe(myOrder);
    });

    it('should allow ADMIN or RECEPTION to view any order', async () => {
      const mockOrder = {
        id: 'ord-123',
        userId: 'patient-456',
        items: [],
      };
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(
        'ord-123',
        'admin-user-id',
        Role.ADMIN,
      );
      expect(result).toBe(mockOrder);
    });
  });

  describe('Order Cancellation & Stock Restoration', () => {
    it('should restore stock when order is cancelled', async () => {
      const mockExistingOrder = {
        id: 'ord-test-1',
        isCancelled: false,
        documentType: DocType.BOLETA,
        documentNumber: 'B001-50',
        items: [
          {
            productId: 'p1',
            quantity: 2,
            product: { id: 'p1', name: 'Item', price: 50 },
          },
        ],
        user: { id: 'u1', firstName: 'Juan', lastName: 'Perez', email: 'j@test.com' },
      };

      mockPrisma.order.findUnique.mockResolvedValue(mockExistingOrder);
      mockPrisma.order.update.mockResolvedValue({
        ...mockExistingOrder,
        isCancelled: true,
        cancellationReason: 'Devolución de producto',
      });
      mockPrisma.product.update.mockResolvedValue({ id: 'p1', stock: 12 });

      const result = await service.cancel('ord-test-1', 'Devolución de producto');

      expect(mockPrisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'p1' },
          data: { stock: { increment: 2 } },
        }),
      );
      expect(mockNubeFact.generateCreditNote).toHaveBeenCalled();
      expect(result.isCancelled).toBe(true);
    });
  });

  describe('retryBilling (Billing Recovery)', () => {
    it('should successfully retry billing for a paid order missing SUNAT voucher', async () => {
      const unpaidOrder = {
        id: 'ord-paid-no-doc',
        isPaid: true,
        documentNumber: null,
        documentType: DocType.BOLETA,
        total: 150,
        items: [],
        user: { email: 'test@user.com' },
      };

      mockPrisma.order.findUnique.mockResolvedValue(unpaidOrder);
      mockPrisma.order.update.mockResolvedValue({
        ...unpaidOrder,
        documentNumber: 'B001-105',
        nubeFactId: 'ext-nube-105',
      });

      const result = await service.retryBilling('ord-paid-no-doc');

      expect(mockNubeFact.generateDocument).toHaveBeenCalledWith(
        unpaidOrder,
        expect.any(String),
        1,
      );
      expect(result?.documentNumber).toBe('B001-105');
    });

    it('should reject retryBilling if order is not marked as paid', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'ord-unpaid',
        isPaid: false,
      });

      await expect(service.retryBilling('ord-unpaid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
