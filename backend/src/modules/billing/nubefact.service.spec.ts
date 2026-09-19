import { NubeFactService } from './nubefact.service';
import { DocType } from '@prisma/client';

describe('NubeFactService', () => {
  let service: NubeFactService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      billingCorrelative: {
        findUnique: jest.fn().mockResolvedValue({ series: 'B001', currentNumber: 5 }),
        upsert: jest.fn().mockResolvedValue({ series: 'B001', currentNumber: 6 }),
      },
    };
    service = new NubeFactService(mockPrisma);
  });

  it('should format SUNAT date strictly as DD-MM-YYYY', () => {
    const testDate = new Date(2026, 8, 18); // Sep 18, 2026
    const formatted = (service as any).formatSunatDate(testDate);
    expect(formatted).toBe('18-09-2026');
  });

  it('should return next correlative as an integer', async () => {
    const next = await service.getNextCorrelative('B001');
    expect(next).toBe(6);
  });

  it('should skip document generation cleanly when token is a placeholder or not set', async () => {
    const result = await service.generateDocument({
      documentType: DocType.BOLETA,
      items: [],
      total: 100,
    });
    expect(result).toBeNull();
  });

  it('should build valid Factura payload with RUC and Razon Social', () => {
    const order = {
      documentType: DocType.FACTURA,
      customerDocType: '6',
      customerDocNumber: '20601234567',
      customerLegalName: 'DERMATOLOGIA CLINICA S.A.C.',
      customerAddress: 'Av. Larco 123, Miraflores',
      total: 118,
      items: [
        {
          productId: 'PROD-1',
          product: { name: 'Serum Facial C' },
          quantity: 1,
          unitPrice: 118,
        },
      ],
      user: { email: 'contabilidad@empresa.com' },
    };

    const payload = (service as any).mapOrderToNubeFact(order, 'F001', 1);

    expect(payload.operacion).toBe('generar_comprobante');
    expect(payload.tipo_de_comprobante).toBe(1);
    expect(payload.serie).toBe('F001');
    expect(payload.numero).toBe(1);
    expect(payload.cliente_tipo_de_documento).toBe(6);
    expect(payload.cliente_numero_de_documento).toBe('20601234567');
    expect(payload.cliente_denominacion).toBe('DERMATOLOGIA CLINICA S.A.C.');
    expect(payload.cliente_direccion).toBe('Av. Larco 123, Miraflores');
    expect(payload.total).toBe(118);
    expect(payload.total_gravada).toBe(100);
    expect(payload.total_igv).toBe(18);
    expect(payload.items[0].valor_unitario).toBe(100);
    expect(payload.items[0].igv).toBe(18);
    expect(payload.items[0].subtotal).toBe(100);
    expect(payload.items[0].total).toBe(118);
  });

  it('should build valid Boleta payload with DNI and integer sequence', () => {
    const order = {
      documentType: DocType.BOLETA,
      customerDocType: '1',
      customerDocNumber: '76543210',
      customerLegalName: 'Juan Perez',
      total: 59,
      items: [
        {
          productId: 'PROD-2',
          product: { name: 'Protector Solar FPS 50' },
          quantity: 1,
          unitPrice: 59,
        },
      ],
      user: { dni: '76543210', email: 'juan@gmail.com' },
    };

    const payload = (service as any).mapOrderToNubeFact(order, 'B001', 25);

    expect(payload.tipo_de_comprobante).toBe(2);
    expect(payload.serie).toBe('B001');
    expect(payload.numero).toBe(25);
    expect(payload.cliente_tipo_de_documento).toBe(1);
    expect(payload.cliente_numero_de_documento).toBe('76543210');
    expect(payload.cliente_denominacion).toBe('Juan Perez');
  });
});
