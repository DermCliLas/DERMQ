import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderSource, DocType, Role, BillingStatus, PaymentMethod } from '@prisma/client';
import { NubeFactService } from '../billing/nubefact.service';
import { EmailService } from '../notifications/email.service';
import { IzipayService } from '../payments/izipay.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private nubeFactService: NubeFactService,
    private emailService: EmailService,
    private izipayService: IzipayService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    currentUser: { userId: string; role: Role } | string,
  ) {
    const user =
      typeof currentUser === 'string'
        ? { userId: currentUser, role: Role.PATIENT }
        : currentUser;
    const {
      items,
      paymentMethod,
      documentType,
      source,
      customerDocType,
      customerDocNumber,
      customerLegalName,
      customerAddress,
    } = createOrderDto;

    // Validación de autorización según rol
    if (user.role === Role.PATIENT) {
      if (source === OrderSource.POS) {
        throw new ForbiddenException(
          'Los pacientes únicamente pueden generar compras a través del canal WEB.',
        );
      }
      if (createOrderDto.patientId && createOrderDto.patientId !== user.userId) {
        throw new ForbiddenException(
          'Los pacientes no pueden registrar compras a nombre de otros usuarios.',
        );
      }
    }

    if (user.role === Role.DOCTOR) {
      if (source === OrderSource.POS) {
        throw new ForbiddenException(
          'Los doctores no tienen autorización para emitir órdenes por canal POS.',
        );
      }
    }

    const isStaff =
      user.role === Role.ADMIN || user.role === Role.RECEPTION;
    const effectiveUserId =
      isStaff && createOrderDto.patientId
        ? createOrderDto.patientId
        : user.userId;
    const effectiveSource = isStaff
      ? (source ?? OrderSource.POS)
      : OrderSource.WEB;

    const resolvedDocType = documentType ?? DocType.BOLETA;

    // Validación fiscal obligatoria para Facturas SUNAT
    if (resolvedDocType === DocType.FACTURA) {
      const trimmedRuc = customerDocNumber?.trim() || '';
      if (!this.isValidRuc(trimmedRuc)) {
        throw new BadRequestException(
          'Para emitir Factura es obligatorio ingresar un número de RUC válido de 11 dígitos con dígito verificador SUNAT correcto.',
        );
      }
      if (!customerLegalName || customerLegalName.trim().length === 0) {
        throw new BadRequestException(
          'Para emitir Factura es obligatorio ingresar la Razón Social de la empresa.',
        );
      }
    }

    // 1. Validate all products exist and have enough stock
    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException(
        'Uno o más productos no fueron encontrados o están inactivos.',
      );
    }

    // Check stock for each item
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}.`,
        );
      }
    }

    // 2. Calculate totals from server-side database prices
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const unitPrice = Number(product.price);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subTotal: unitPrice * item.quantity,
      };
    });

    const total = orderItems.reduce((sum, i) => sum + i.subTotal, 0);

    // 3. Determinar estado de pago de forma segura
    let isPaid = false;
    let paymentTxRef: string | null = null;

    if (effectiveSource === OrderSource.POS && isStaff) {
      // Personal administrativo/caja cobrando presencialmente en POS
      isPaid = true;
    } else {
      // Toda compra web se inicializa como pendiente de pago
      // Las compras con tarjeta deben pasar obligatoriamente por el flujo estricto Izipay
      isPaid = false;
    }

    // 4. Run everything inside a Prisma transaction
    let order: any;
    try {
      order = await this.prisma.$transaction(async (tx) => {
        // Create the order
        const createdOrder = await tx.order.create({
          data: {
            userId: effectiveUserId,
            total,
            paymentMethod,
            paymentReference: paymentTxRef,
            isPaid,
            billingStatus: isPaid ? BillingStatus.PENDING : BillingStatus.PENDING,
            documentType: resolvedDocType,
            source: effectiveSource,
            customerDocType:
              resolvedDocType === DocType.FACTURA
                ? '6'
                : (customerDocType ?? '1'),
            customerDocNumber: customerDocNumber?.trim() || null,
            customerLegalName: customerLegalName?.trim() || null,
            customerAddress: customerAddress?.trim() || null,
            items: {
              create: orderItems,
            },
          },
          include: {
            items: {
              include: {
                product: {
                  select: { id: true, name: true, sku: true, price: true },
                },
              },
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                dni: true,
                phone: true,
              },
            },
          },
        });

        // Decrement stock for each product atomically (prevents concurrency race conditions and negative inventory)
        for (const item of items) {
          const updateResult = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.quantity },
            },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          if (updateResult.count === 0) {
            throw new BadRequestException(
              `Stock insuficiente o agotado en tiempo real al procesar la venta.`,
            );
          }
        }

        return createdOrder;
      });
    } catch (error: any) {
      // Manejar restricción de unicidad para evitar 500 en concurrencia (anti-replay race condition)
      if (
        error?.code === 'P2002' &&
        (error?.meta?.target?.includes('paymentReference') ||
          String(error?.meta?.target).includes('paymentReference'))
      ) {
        throw new BadRequestException(
          'Esta transacción de pago ya ha sido procesada previamente (pago duplicado detectado por restricción única).',
        );
      }
      throw error;
    }

    // 5. Emitir Comprobante Electrónico (NubeFact) de forma atómica e idempotente si la orden ya está pagada
    let finalOrder = order;
    if (order.isPaid) {
      try {
        finalOrder = await this.retryBilling(order.id);
      } catch (billingErr: any) {
        this.logger.warn(
          `[NubeFact] Emisión de comprobante diferida para orden ${order.id}: ${billingErr.message}`,
        );
      }
    }

    // ─── EMAIL INVOICE NOTIFICATION ──────────────────────────────────────────
    if (finalOrder && finalOrder.nubeFactPdfUrl) {
      this.emailService
        .sendOrderInvoice(finalOrder, {
          documentNumber: finalOrder.documentNumber,
          pdfUrl: finalOrder.nubeFactPdfUrl,
          xmlUrl: finalOrder.nubeFactXmlUrl,
        })
        .catch((err) =>
          console.error('Error sending order invoice email:', err),
        );
    }

    return finalOrder;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { product: { select: { id: true, name: true, sku: true } } },
        },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, imageUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string, userRole?: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
    if (!order) throw new NotFoundException(`Orden con ID ${id} no encontrada`);

    // Proteger contra IDOR:
    // ADMIN y RECEPTION tienen visibilidad total de órdenes
    const isStaff = userRole === Role.ADMIN || userRole === Role.RECEPTION;
    if (!isStaff) {
      // Para pacientes o cualquier otro rol:
      // Si la orden no tiene userId (ej. venta POS sin registrar paciente) o es de otro usuario -> Forbidden
      if (!order.userId || order.userId !== userId) {
        throw new ForbiddenException(
          'No tienes permisos para acceder a los detalles de esta orden.',
        );
      }
    }

    return order;
  }

  async cancel(orderId: string, reason: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, dni: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    if (order.isCancelled) {
      throw new BadRequestException('Esta orden ya ha sido anulada previamente.');
    }

    // 1. Marcar la orden como anulada y reponer stock de forma atómica en DB
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const cancelled = await tx.order.update({
        where: { id: orderId },
        data: {
          isCancelled: true,
          cancellationReason: reason,
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, sku: true, price: true },
              },
            },
          },
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, dni: true },
          },
        },
      });

      // Reponer stock
      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      }

      return cancelled;
    });

    // 2. Emitir Nota de Crédito en NubeFact FUERA de la transacción de DB para evitar locks prolongados
    if (order.documentNumber) {
      try {
        const creditNoteResult = await this.nubeFactService.generateCreditNote(
          order,
          reason,
        );

        if (creditNoteResult) {
          return await this.prisma.order.update({
            where: { id: orderId },
            data: {
              creditNoteNumber: creditNoteResult.documentNumber,
              creditNotePdfUrl: creditNoteResult.pdfUrl,
              creditNoteXmlUrl: creditNoteResult.xmlUrl,
            },
            include: {
              items: {
                include: { product: true },
              },
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  dni: true,
                },
              },
            },
          });
        }
      } catch (err) {
        console.error(
          `[NubeFact] Error al emitir Nota de Crédito para orden ${orderId}: ${err.message}`,
        );
      }
    }

    return updatedOrder;
  }

  /**
   * Valida un número de RUC según el algoritmo módulo 11 de la SUNAT.
   */
  isValidRuc(ruc: string): boolean {
    if (!/^\d{11}$/.test(ruc)) return false;
    const prefix = ruc.substring(0, 2);
    if (!['10', '15', '16', '17', '20'].includes(prefix)) return false;

    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(ruc[i], 10) * weights[i];
    }

    const remainder = sum % 11;
    let checkDigit = 11 - remainder;
    if (checkDigit === 10) checkDigit = 0;
    else if (checkDigit === 11) checkDigit = 1;

    return checkDigit === parseInt(ruc[10], 10);
  }

  async retryBilling(orderId: string) {
    // 1. Bloqueo a nivel de fila y reserva atómica del correlativo
    const lockedInfo = await this.prisma.$transaction(async (tx) => {
      let orderRow: any;
      if (typeof tx.$queryRaw === 'function') {
        try {
          const rows = await tx.$queryRaw<
            Array<{
              id: string;
              isPaid: boolean;
              documentType: DocType;
              documentNumber: string | null;
              billingStatus: BillingStatus;
            }>
          >`SELECT id, "isPaid", "documentType", "documentNumber", "billingStatus" FROM "Order" WHERE id = ${orderId} FOR UPDATE`;
          if (rows && rows.length > 0) {
            orderRow = rows[0];
          }
        } catch {
          // Fallback a findUnique
        }
      }
      if (!orderRow) {
        orderRow = await tx.order.findUnique({ where: { id: orderId } });
      }

      if (!orderRow) {
        throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
      }

      if (!orderRow.isPaid) {
        throw new BadRequestException(
          'No se puede emitir comprobante de una orden que no está marcada como pagada.',
        );
      }

      // Idempotencia: Si ya está emitida con comprobante confirmado, no duplicar
      if (
        orderRow.billingStatus === BillingStatus.ISSUED &&
        orderRow.documentNumber
      ) {
        return {
          alreadyIssued: true,
          documentNumber: orderRow.documentNumber,
        };
      }

      let docNum = orderRow.documentNumber;

      // Si aún no tiene un documentNumber asignado, reservamos y persistimos el correlativo
      if (!docNum) {
        const isFactura = orderRow.documentType === DocType.FACTURA;
        const series = isFactura
          ? process.env.NUBEFACT_SERIES_FACTURA || 'F001'
          : process.env.NUBEFACT_SERIES_BOLETA || 'B001';

        const correlativeRecord = await tx.billingCorrelative.upsert({
          where: { series },
          update: { currentNumber: { increment: 1 } },
          create: { series, currentNumber: 1 },
        });

        docNum = `${series}-${correlativeRecord.currentNumber}`;

        await tx.order.update({
          where: { id: orderId },
          data: {
            documentNumber: docNum,
            billingStatus: BillingStatus.PENDING,
          },
        });
      }

      return {
        alreadyIssued: false,
        documentNumber: docNum,
      };
    });

    if (lockedInfo.alreadyIssued) {
      return this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, sku: true, price: true },
              },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              dni: true,
              phone: true,
            },
          },
        },
      });
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, price: true },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            dni: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    const currentDocNumber = lockedInfo.documentNumber;
    const [targetSeries, numStr] = currentDocNumber.split('-');
    const num = parseInt(numStr, 10);
    const tipoDoc = order.documentType === DocType.FACTURA ? 1 : 2;

    // 2. Reconciliación previa: Consultar a NubeFact si ya procesó este comprobante
    if (targetSeries && !isNaN(num)) {
      const consultResult = await this.nubeFactService.consultDocument(
        tipoDoc,
        targetSeries,
        num,
      );

      if (consultResult.status === 'FOUND') {
        return this.prisma.order.update({
          where: { id: order.id },
          data: {
            billingStatus: BillingStatus.ISSUED,
            billingError: null,
            nubeFactId: consultResult.externalId,
            nubeFactPdfUrl: consultResult.pdfUrl,
            nubeFactXmlUrl: consultResult.xmlUrl,
          },
          include: {
            items: { include: { product: true } },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                dni: true,
                phone: true,
              },
            },
          },
        });
      }

      // Si hubo error de red al consultar NubeFact, NO emitir otro comprobante!
      if (consultResult.status === 'NETWORK_ERROR') {
        await this.prisma.order.update({
          where: { id: order.id },
          data: {
            billingStatus: BillingStatus.FAILED,
            billingError: consultResult.error,
          },
        });
        throw new BadRequestException(
          `No se pudo verificar el estado en NubeFact por error de red: ${consultResult.error}. Reintente más tarde.`,
        );
      }
    }

    // 3. Emitir a NubeFact usando el correlativo ya reservado de forma persistente y atómica
    try {
      const billingResult = await this.nubeFactService.generateDocument(
        order,
        targetSeries,
        num,
      );

      if (!billingResult) {
        await this.prisma.order.update({
          where: { id: order.id },
          data: {
            billingStatus: BillingStatus.FAILED,
            billingError: 'NubeFact no devolvió comprobante generado',
          },
        });
        throw new BadRequestException(
          'NubeFact no pudo emitir el comprobante. Revise credenciales o configuración.',
        );
      }

      return this.prisma.order.update({
        where: { id: order.id },
        data: {
          documentNumber: billingResult.documentNumber,
          nubeFactId: billingResult.externalId,
          nubeFactPdfUrl: billingResult.pdfUrl,
          nubeFactXmlUrl: billingResult.xmlUrl,
          billingStatus: BillingStatus.ISSUED,
          billingError: null,
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, sku: true, price: true },
              },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              dni: true,
              phone: true,
            },
          },
        },
      });
    } catch (err: any) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          billingStatus: BillingStatus.FAILED,
          billingError: err.message,
        },
      });
      throw err;
    }
  }

  /**
   * Confirma el pago de una orden pendiente vinculada a Izipay.
   * Valida estrictamente autorización, estado de la orden, firma HMAC,
   * monto en céntimos y vinculación al orderId real.
   */
  async confirmPayment(
    orderId: string,
    krAnswer: string | object,
    krHash: string,
    userContext?: { userId?: string; role?: Role },
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`La orden con id ${orderId} no existe.`);
    }

    // 1. Autorización estricta:
    // Si la orden pertenece a un usuario registrado, se requiere autenticación obligatoria
    if (order.userId) {
      if (!userContext || !userContext.userId) {
        throw new ForbiddenException(
          'Esta orden pertenece a un usuario registrado. Se requiere autenticación.',
        );
      }
      const isOwner = userContext.userId === order.userId;
      const isStaff =
        userContext.role === Role.ADMIN ||
        userContext.role === Role.RECEPTION;
      if (!isOwner && !isStaff) {
        throw new ForbiddenException(
          'No tienes autorización para confirmar o consultar el pago de esta orden.',
        );
      }
    }

    // 2. Restricción estricta de canal y método: solo WEB con tarjeta de crédito
    if (
      order.source !== OrderSource.WEB ||
      order.paymentMethod !== PaymentMethod.CREDIT_CARD
    ) {
      throw new BadRequestException(
        'Solo las órdenes WEB creadas con método CREDIT_CARD pueden confirmarse mediante esta pasarela.',
      );
    }

    if (order.isCancelled) {
      throw new BadRequestException('No se puede pagar una orden cancelada.');
    }

    // 3. Validación criptográfica HMAC-SHA256 vinculada estrictamente al monto y al orderId
    const expectedAmountInCents = Math.round(order.total * 100);
    const paymentValidation = this.izipayService.validatePaymentDetails(
      krAnswer,
      krHash,
      expectedAmountInCents,
      'PEN',
      order.id, // Estrictamente vinculado al orderId de la orden en la BD
    );

    if (!paymentValidation.valid) {
      throw new BadRequestException(
        `Validación de pago fallida: ${paymentValidation.reason}. Transacción cancelada.`,
      );
    }

    // 4. Retorno seguro e idempotente SI Y SÓLO SI ya se validó la firma criptográfica y autorización
    if (order.isPaid) {
      return order;
    }

    // 5. Prevención de ataque de repetición (Replay Attack)
    const paymentTxRef = paymentValidation.transactionId || null;

    if (paymentTxRef) {
      const existing = await this.prisma.order.findUnique({
        where: { paymentReference: paymentTxRef },
      });
      if (existing && existing.id !== order.id) {
        throw new BadRequestException(
          'Esta transacción de pago ya ha sido procesada previamente en otra orden (replay attack).',
        );
      }
    }

    try {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          isPaid: true,
          paymentReference: paymentTxRef,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new BadRequestException(
          'Esta transacción de pago ya ha sido procesada previamente en otra orden (P2002).',
        );
      }
      throw err;
    }

    // 6. Emisión de comprobante idempotente
    try {
      await this.retryBilling(order.id);
    } catch (billingErr: any) {
      this.logger.warn(
        `Emisión de comprobante diferida para orden pagada ${order.id}: ${billingErr.message}`,
      );
    }

    return this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });
  }
}
