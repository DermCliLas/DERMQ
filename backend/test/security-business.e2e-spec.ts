import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role, OrderSource, DocType, PaymentMethod, AppointmentStatus, BillingStatus } from '@prisma/client';
import { IzipayService } from '../src/modules/payments/izipay.service';
import { NubeFactService } from '../src/modules/billing/nubefact.service';
import * as crypto from 'crypto';

describe('DERMQ Production Security & Business E2E Suite', () => {
  jest.setTimeout(30000);

  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let izipayService: IzipayService;
  let nubeFactService: NubeFactService;

  let patientToken: string;
  let otherPatientToken: string;
  let adminToken: string;
  let doctorToken: string;

  let testPatientId: string;
  let otherPatientId: string;
  let testDoctorId: string;
  let testServiceId: string;
  let testProductId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);
    izipayService = app.get(IzipayService);
    // Configure real cryptographic HMAC key for Izipay to test real crypto verification
    const realHmacKey = 'e2e-secret-financial-hmac-key-32bytes!';
    (izipayService as any).hmacKey = realHmacKey;
    jest.spyOn(izipayService, 'generateFormToken').mockImplementation(async (amount, currency, orderId, email) => {
      return 'form-token-e2e-' + orderId;
    });

    // Setup Test Fixtures in Database with valid UUIDs
    testPatientId = crypto.randomUUID();
    otherPatientId = crypto.randomUUID();
    testDoctorId = crypto.randomUUID();

    // 1. Create Patient 1
    const p1 = await prisma.user.create({
      data: {
        id: testPatientId,
        email: `patient-${Date.now()}@test.com`,
        firstName: 'Ana',
        lastName: 'Paciente',
        password: 'hashed-password',
        role: Role.PATIENT,
      },
    });

    // 2. Create Patient 2 (victim/other)
    const p2 = await prisma.user.create({
      data: {
        id: otherPatientId,
        email: `other-${Date.now()}@test.com`,
        firstName: 'Luis',
        lastName: 'Victima',
        password: 'hashed-password',
        role: Role.PATIENT,
      },
    });

    // 3. Create Doctor
    await prisma.user.create({
      data: {
        id: testDoctorId,
        email: `doctor-${Date.now()}@dermq.com`,
        firstName: 'Dra.',
        lastName: 'Leyva',
        specialty: 'Dermatología',
        password: 'hashed-password',
        role: Role.DOCTOR,
      },
    });

    // 4. Create Category & Medical Service
    const category = await prisma.category.create({
      data: {
        name: 'Categoría E2E ' + Date.now(),
      },
    });

    const service = await prisma.service.create({
      data: {
        categoryId: category.id,
        name: 'Consulta Dermatológica E2E',
        description: 'Test Service',
        price: 150.0,
        durationMin: 30,
        isActive: true,
      },
    });
    testServiceId = service.id;

    // 5. Create Test Product with initial stock = 1
    const product = await prisma.product.create({
      data: {
        name: 'Serum Vitamina C E2E',
        sku: 'E2E-SERUM-' + Date.now(),
        price: 100.0,
        stock: 1,
        isActive: true,
      },
    });
    testProductId = product.id;

    // Generate JWT Tokens
    patientToken = jwtService.sign({ sub: p1.id, email: p1.email, role: Role.PATIENT });
    otherPatientToken = jwtService.sign({ sub: p2.id, email: p2.email, role: Role.PATIENT });
    adminToken = jwtService.sign({ sub: 'admin-e2e', email: 'admin@dermq.com', role: Role.ADMIN });
    doctorToken = jwtService.sign({ sub: testDoctorId, email: 'dr@dermq.com', role: Role.DOCTOR });
  });

  afterAll(async () => {
    // Cleanup created test records
    try {
      await prisma.appointment.deleteMany({ where: { doctorId: testDoctorId } });
      await prisma.orderItem.deleteMany({ where: { productId: testProductId } });
      await prisma.order.deleteMany({ where: { userId: { in: [testPatientId, otherPatientId] } } });
      await prisma.product.deleteMany({ where: { id: testProductId } });
      await prisma.service.deleteMany({ where: { id: testServiceId } });
      await prisma.category.deleteMany({ where: { name: { startsWith: 'Categoría E2E' } } });
      await prisma.siteContent.deleteMany({ where: { section: 'hero-test' } });
      await prisma.user.deleteMany({ where: { id: { in: [testPatientId, otherPatientId, testDoctorId] } } });
      await prisma.$disconnect();
    } catch (e) {
      // Ignore cleanup error
    }
    await app.close();
  });

  it('1. Registro nunca permite crear ADMIN (privilege escalation blocked)', async () => {
    const maliciousEmail = `attacker-${Date.now()}@test.com`;

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: maliciousEmail,
        password: 'Password123!',
        firstName: 'Malicious',
        lastName: 'User',
        role: 'ADMIN', // Attacker attempts to become admin
      });

    // Clean up created user
    const createdUser = await prisma.user.findUnique({ where: { email: maliciousEmail } });
    if (createdUser) {
      expect(createdUser.role).toBe(Role.PATIENT);
      await prisma.user.delete({ where: { id: createdUser.id } });
    }
  });

  it('2. CMS solo permite escritura a ADMIN', async () => {
    // Patient attempts to update site content -> 403 Forbidden
    await request(app.getHttpServer())
      .put('/site-content/hero-test')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ data: { title: 'Hacked Site' } })
      .expect(403);

    // Unauthenticated attempt -> 401 Unauthorized
    await request(app.getHttpServer())
      .put('/site-content/hero-test')
      .send({ data: { title: 'Hacked Site' } })
      .expect(401);

    // Admin attempt -> 200 OK
    await request(app.getHttpServer())
      .put('/site-content/hero-test')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ data: { title: 'Authorized Admin Site' } })
      .expect(200);
  });

  it('3. Storage rechaza usuarios no autorizados y archivos disfrazados', async () => {
    // Patient cannot upload to general assets -> 403 Forbidden
    await request(app.getHttpServer())
      .post('/storage/upload')
      .set('Authorization', `Bearer ${patientToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xe0]), 'photo.jpg')
      .expect(403);

    // Admin uploading disguised PHP script disguised as JPEG -> 400 Bad Request
    const disguisedFile = Buffer.from('<?php echo "evil"; ?>');
    await request(app.getHttpServer())
      .post('/storage/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', disguisedFile, 'photo.jpg')
      .expect(400);
  });

  it('4. Paciente no puede listar órdenes globales', async () => {
    // Patient attempting GET /orders -> 403 Forbidden
    await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(403);

    // Admin attempting GET /orders -> 200 OK
    await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('5. Paciente no puede consultar órdenes ajenas ni órdenes POS sin userId (IDOR)', async () => {
    // Create an order belonging to otherPatient
    const otherOrder = await prisma.order.create({
      data: {
        userId: otherPatientId,
        total: 100.0,
        paymentMethod: PaymentMethod.CASH,
        isPaid: false,
        source: OrderSource.WEB,
      },
    });

    // Create an anonymous POS walk-in order (userId: null)
    const anonymousPosOrder = await prisma.order.create({
      data: {
        userId: null,
        total: 50.0,
        paymentMethod: PaymentMethod.CASH,
        isPaid: true,
        source: OrderSource.POS,
      },
    });

    // Patient 1 tries to view Patient 2's order -> 403 Forbidden
    await request(app.getHttpServer())
      .get(`/orders/${otherOrder.id}`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(403);

    // Patient 1 tries to view anonymous POS order -> 403 Forbidden
    await request(app.getHttpServer())
      .get(`/orders/${anonymousPosOrder.id}`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(403);

    // Admin can view both orders
    await request(app.getHttpServer())
      .get(`/orders/${otherOrder.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Clean up orders
    await prisma.order.deleteMany({ where: { id: { in: [otherOrder.id, anonymousPosOrder.id] } } });
  });

  it('6. Paciente no puede crear órdenes POS', async () => {
    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        items: [{ productId: testProductId, quantity: 1 }],
        paymentMethod: PaymentMethod.CASH,
        source: OrderSource.POS, // Patient sending POS source
      })
      .expect(403);
  });

  it('7. Dos compras simultáneas no generan stock negativo', async () => {
    // Set stock to exactly 1
    await prisma.product.update({
      where: { id: testProductId },
      data: { stock: 1 },
    });

    const buyOrderPayload = {
      items: [{ productId: testProductId, quantity: 1 }],
      paymentMethod: PaymentMethod.CASH,
      source: OrderSource.WEB,
    };

    // Fire 2 simultaneous purchase requests
    const [res1, res2] = await Promise.all([
      request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(buyOrderPayload),
      request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${otherPatientToken}`)
        .send(buyOrderPayload),
    ]);

    const statuses = [res1.status, res2.status];
    // Exactly one should succeed (201) and one should fail (400)
    expect(statuses).toContain(201);
    expect(statuses).toContain(400);

    // Stock in database must be exactly 0, NEVER negative (-1)
    const productAfter = await prisma.product.findUnique({ where: { id: testProductId } });
    expect(productAfter?.stock).toBe(0);
  });

  it('8. Dos citas simultáneas no generan solapamiento', async () => {
    // Schedule on next Monday at 11:00 AM local business hours
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + ((1 + 7 - appointmentDate.getDay()) % 7 || 7));
    appointmentDate.setHours(11, 0, 0, 0);

    const appointmentPayload = {
      doctorId: testDoctorId,
      serviceId: testServiceId,
      date: appointmentDate.toISOString(),
      notes: 'Test concurrency appointment',
    };

    // Fire 2 simultaneous booking requests for the same slot
    const [res1, res2] = await Promise.all([
      request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ ...appointmentPayload, patientId: testPatientId }),
      request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${otherPatientToken}`)
        .send({ ...appointmentPayload, patientId: otherPatientId }),
    ]);

    const statuses = [res1.status, res2.status];
    expect(statuses).toContain(201);
    expect(statuses).toContain(400);

    // Verify in DB that only 1 appointment exists for that time slot
    const appointmentsInSlot = await prisma.appointment.findMany({
      where: {
        doctorId: testDoctorId,
        date: appointmentDate,
      },
    });
    expect(appointmentsInSlot.length).toBe(1);
  });

  it('9. Validación criptográfica real de Izipay, vinculación a orden y protección anti-replay', async () => {
    // Reabastecer stock tras la prueba de stock concurrente 7
    await prisma.product.update({
      where: { id: testProductId },
      data: { stock: 10 },
    });

    // 1. Crear una orden pendiente real en el servidor
    const pendingOrderRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        items: [{ productId: testProductId, quantity: 1 }],
        paymentMethod: PaymentMethod.CREDIT_CARD,
        source: OrderSource.WEB,
      });

    expect(pendingOrderRes.status).toBe(201);
    const orderData = pendingOrderRes.body.data || pendingOrderRes.body;
    const orderId = orderData.id;
    expect(orderData.isPaid).toBe(false);

    // 2. Token de pago: No acepta montos arbitrarios del cliente y exige orden pendiente real
    await request(app.getHttpServer())
      .post('/payments/izipay/token')
      .send({ amount: 1.0 }) // Falta orderId
      .expect(400);

    // Paciente ajeno intentando generar token para la orden de otro usuario
    await request(app.getHttpServer())
      .post('/payments/izipay/token')
      .set('Authorization', `Bearer ${otherPatientToken}`)
      .send({ orderId })
      .expect(403);

    // Dueño legítimo genera token: Monto calculado desde la BD (S/ 100.00)
    const tokenRes = await request(app.getHttpServer())
      .post('/payments/izipay/token')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ orderId })
      .expect(201);

    const tokenData = tokenRes.body.data || tokenRes.body;
    expect(tokenData.formToken).toBeDefined();
    expect(tokenData.amount).toBe(100.0);

    // 3. Validación criptográfica: Firma HMAC-SHA256 adulterada es rechazada
    const uniqueTxUuid = 'tx-e2e-real-' + Date.now();
    const realHmacKey = 'e2e-secret-financial-hmac-key-32bytes!';

    const validPayload = {
      orderStatus: 'PAID',
      orderDetails: {
        orderId,
        orderTotalAmount: 10000, // S/ 100.00 en céntimos
        orderCurrency: 'PEN',
      },
      transactions: [{ uuid: uniqueTxUuid, status: 'PAID', amount: 10000, currency: 'PEN' }],
    };
    const validRawAnswer = JSON.stringify(validPayload);
    const validHmac = crypto.createHmac('sha256', realHmacKey).update(validRawAnswer, 'utf8').digest('hex');

    // Intento con firma falsificada -> Rechazado con 400
    await request(app.getHttpServer())
      .post('/payments/izipay/confirm')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        orderId,
        krAnswer: validRawAnswer,
        krHash: 'hash-falsificado-por-atacante',
      })
      .expect(400);

    // Intento con monto adulterado (pagó S/ 1.00 en lugar de S/ 100.00) -> Rechazado con 400
    const tamperedPayload = {
      ...validPayload,
      orderDetails: { ...validPayload.orderDetails, orderTotalAmount: 100 },
    };
    const tamperedRawAnswer = JSON.stringify(tamperedPayload);
    const tamperedHmac = crypto.createHmac('sha256', realHmacKey).update(tamperedRawAnswer, 'utf8').digest('hex');

    await request(app.getHttpServer())
      .post('/payments/izipay/confirm')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        orderId,
        krAnswer: tamperedRawAnswer,
        krHash: tamperedHmac,
      })
      .expect(400);

    // 4. Pago legítimo con firma HMAC auténtica -> Confirmado exitosamente
    const confirmRes = await request(app.getHttpServer())
      .post('/payments/izipay/confirm')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        orderId,
        krAnswer: validRawAnswer,
        krHash: validHmac,
      })
      .expect(201);

    const paidOrder = confirmRes.body.data || confirmRes.body;
    expect(paidOrder.isPaid).toBe(true);
    expect(paidOrder.paymentReference).toBe(uniqueTxUuid);

    // 5. Ataque de repetición (Replay attack): Enviar la misma transacción para otra orden -> Rechazado
    const secondOrderRes = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        items: [{ productId: testProductId, quantity: 1 }],
        paymentMethod: PaymentMethod.CREDIT_CARD,
        source: OrderSource.WEB,
      });
    const secondOrderId = (secondOrderRes.body.data || secondOrderRes.body).id;

    const replayRawAnswer = JSON.stringify({
      ...validPayload,
      orderDetails: { ...validPayload.orderDetails, orderId: secondOrderId },
    });
    const replayHmac = crypto.createHmac('sha256', realHmacKey).update(replayRawAnswer, 'utf8').digest('hex');

    const replayRes = await request(app.getHttpServer())
      .post('/payments/izipay/confirm')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        orderId: secondOrderId,
        krAnswer: replayRawAnswer,
        krHash: replayHmac,
      });

    expect(replayRes.status).toBe(400);
    expect(replayRes.body.message || replayRes.text).toContain('replay attack');

    // 6. Prevención de fuga de información: Petición sin token no puede consultar orden pagada
    await request(app.getHttpServer())
      .post('/payments/izipay/confirm')
      .send({
        orderId,
        krAnswer: 'dummy',
        krHash: 'dummy',
      })
      .expect(403);
  });

  it('10. NubeFact: Reconciliación real ante pérdida de respuesta HTTP y prevención de duplicados', async () => {
    // 1. Crear una orden pagada sin documentNumber asignado
    const pendingBillingOrder = await prisma.order.create({
      data: {
        userId: testPatientId,
        total: 100.0,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        isPaid: true,
        source: OrderSource.WEB,
        billingStatus: BillingStatus.PENDING,
      },
    });

    // 2. Simular pérdida de respuesta HTTP en la primera llamada (la petición llegó a NubeFact pero la red se cayó)
    const originalFetch = global.fetch;
    let callCount = 0;
    let consultCount = 0;
    let emittedSeries = '';
    let emittedNumber = 0;

    global.fetch = jest.fn().mockImplementation(async (url: any, opts: any) => {
      callCount++;
      const body = JSON.parse(opts.body);

      if (body.operacion === 'consultar_comprobante') {
        consultCount++;
        if (consultCount === 1) {
          // En el primer intento aún no existía en NubeFact
          return {
            ok: false,
            status: 404,
            json: async () => ({ errors: 'Comprobante no encontrado' }),
          };
        }
        // En el segundo intento (reconciliación tras caída de red), NubeFact sí lo tiene
        return {
          ok: true,
          json: async () => ({
            serie: body.serie,
            numero: body.numero,
            invoice_id: `${body.serie}-${body.numero}`,
            enlace_del_pdf: `https://nubefact.com/${body.serie}-${body.numero}.pdf`,
            enlace_del_xml: `https://nubefact.com/${body.serie}-${body.numero}.xml`,
          }),
        };
      }

      // Primera emisión de generar_comprobante: Simular que la red se corta tras enviar los datos a NubeFact
      emittedSeries = body.serie;
      emittedNumber = body.numero;
      throw new TypeError('fetch failed: Connection reset by peer (ECONNRESET)');
    }) as any;

    try {
      // Intento 1: Falla la red al emitir
      await request(app.getHttpServer())
        .post(`/orders/${pendingBillingOrder.id}/retry-billing`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      // Verificar que el backend reservó y guardó de forma estable el documentNumber antes de caerse
      const orderAfterFail = await prisma.order.findUnique({ where: { id: pendingBillingOrder.id } });
      expect(orderAfterFail?.documentNumber).toBeDefined();
      expect(orderAfterFail?.documentNumber).toBe(`${emittedSeries}-${emittedNumber}`);
      expect(orderAfterFail?.billingStatus).toBe(BillingStatus.FAILED);

      // Intento 2 (Reintento): El backend reconcilia primero con consultDocument usando esa referencia estable
      const retryRes = await request(app.getHttpServer())
        .post(`/orders/${pendingBillingOrder.id}/retry-billing`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      const reconciledOrder = retryRes.body.data || retryRes.body;
      expect(reconciledOrder.billingStatus).toBe(BillingStatus.ISSUED);
      expect(reconciledOrder.documentNumber).toBe(`${emittedSeries}-${emittedNumber}`);
      expect(reconciledOrder.nubeFactPdfUrl).toContain('.pdf');

      // Limpieza
      await prisma.order.delete({ where: { id: pendingBillingOrder.id } });
    } finally {
      global.fetch = originalFetch;
    }
  });
});
