import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { randomUUID } from 'crypto';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { StorageService } from '../src/modules/storage/storage.service';
import { GoogleCalendarService } from '../src/modules/appointments/google-calendar.service';
import { EmailService } from '../src/modules/notifications/email.service';
import { assertLocalTestDatabase } from './assert-test-database';

describe('Booking privacy and timezone regressions', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const patientId = randomUUID(), doctorId = randomUUID(), adminId = randomUUID();
  const categoryId = randomUUID(), serviceId = randomUUID();
  const prefix = `booking-${randomUUID()}`;
  const email = `${prefix}@example.com`, adminEmail = `${prefix}-admin@example.com`, guestEmail = `${prefix}-guest@example.com`;
  const now = new Date();
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 14, 16));
  day.setUTCDate(day.getUTCDate() + ((8 - day.getUTCDay()) % 7)); // future Monday at 11:00 Lima
  const slot = day.toISOString();
  const dayString = slot.slice(0, 10);
  const body = () => ({ firstName: 'Guest', lastName: 'Test', email: guestEmail, doctorId, serviceId, date: slot });

  beforeAll(async () => {
    assertLocalTestDatabase();
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(StorageService).useValue({})
      .overrideProvider(GoogleCalendarService).useValue({ listEvents: jest.fn().mockResolvedValue([]), createEvent: jest.fn().mockResolvedValue(null), deleteEvent: jest.fn() })
      .overrideProvider(EmailService).useValue({ sendAppointmentPendingPatient: jest.fn().mockResolvedValue(null), sendNewAppointmentAlert: jest.fn().mockResolvedValue(null), sendAppointmentConfirmation: jest.fn().mockResolvedValue(null), sendAppointmentCancelled: jest.fn().mockResolvedValue(null) })
      .compile();
    app = module.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.user.createMany({ data: [
      { id: patientId, email, dni: '47192836', phone: '999000123', firstName: 'Patient', lastName: 'Test', password: 'unused', role: 'PATIENT' },
      { id: doctorId, email: `${prefix}-doctor@example.com`, firstName: 'Doctor', lastName: 'Test', password: 'unused', role: 'DOCTOR' },
      { id: adminId, email: adminEmail, firstName: 'Admin', lastName: 'Test', password: 'unused', role: 'ADMIN' },
    ] });
    await prisma.category.create({ data: { id: categoryId, name: 'Regression category' } });
    await prisma.service.create({ data: { id: serviceId, categoryId, name: 'Regression service', price: 100, durationMin: 30 } });
    token = app.get(JwtService).sign({ sub: patientId, email, role: 'PATIENT', type: 'access' });
  });

  afterAll(async () => {
    if (!prisma) return;
    await prisma.appointment.deleteMany({ where: { doctorId } });
    await prisma.user.deleteMany({ where: { email: { startsWith: prefix } } });
    await prisma.service.deleteMany({ where: { id: serviceId } });
    await prisma.category.deleteMany({ where: { id: categoryId } });
    await app.close();
  });

  it('rejects reuse of existing patient by email or DNI and does not return private details', async () => {
    for (const identity of [{ email: email.toUpperCase() }, { email: `${prefix}-other@example.com`, dni: '47192836' }, { email: adminEmail }]) {
      const res = await request(app.getHttpServer()).post('/appointments/guest').send({ ...body(), ...identity });
      expect(res.status).toBe(409);
      expect(JSON.stringify(res.body)).not.toContain('999000123');
    }
    expect(await prisma.appointment.count({ where: { doctorId } })).toBe(0);
  });

  it('rejects malformed requests and removes a new guest when reservation fails', async () => {
    await request(app.getHttpServer()).post('/appointments/guest').send({ email: guestEmail }).expect(400);
    await request(app.getHttpServer()).post('/appointments/guest').send({ ...body(), date: '2020-01-01T16:00:00Z' }).expect(400);
    expect(await prisma.user.findUnique({ where: { email: guestEmail } })).toBeNull();
  });

  it('lets a new guest book while returning only minimal information', async () => {
    const res = await request(app.getHttpServer()).post('/appointments/guest').send(body()).expect(201);
    expect(res.body.data.status).toBe('PENDING');
    expect(Object.keys(res.body.data).sort()).toEqual(['date', 'id', 'status']);
  });

  it('blocks a booking and hides the slot when an arrived appointment overlaps', async () => {
    const arrived = new Date(day.getTime() + 60 * 60 * 1000);
    await prisma.appointment.create({ data: { doctorId, patientId, serviceId, date: arrived, status: 'ARRIVED' } });
    await request(app.getHttpServer()).post('/appointments').set('Authorization', `Bearer ${token}`)
      .send({ patientId, doctorId, serviceId, date: arrived.toISOString() }).expect(400);
    const slots = await request(app.getHttpServer()).get(`/appointments/available-slots/${doctorId}?date=${dayString}`).expect(200);
    const values: Array<{time: string}> = slots.body.data.slots;
    expect(values.some((item) => item.time === arrived.toISOString())).toBe(false);
    expect(values[0].time).toBe(`${dayString}T13:00:00.000Z`); // 08:00 Lima even with server TZ=UTC
  });
});
