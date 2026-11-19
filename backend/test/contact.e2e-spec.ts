import { Test } from '@nestjs/testing';
import { INestApplication, ServiceUnavailableException } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { StorageService } from '../src/modules/storage/storage.service';
import { EmailService } from '../src/modules/notifications/email.service';
import { assertLocalTestDatabase } from './assert-test-database';

describe('Public contact form', () => {
  let app: INestApplication;
  const sendContactMessage = jest.fn();
  const body = { firstName: 'Ana', lastName: 'Prueba', email: 'ana@example.com', phone: '', subject: 'consulta', message: 'Información de prueba' };

  beforeAll(async () => {
    assertLocalTestDatabase();
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService).useValue({})
      .overrideProvider(StorageService).useValue({})
      .overrideProvider(EmailService).useValue({ sendContactMessage })
      .compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => { if (app) await app.close(); });

  it('accepts valid input only after the mail provider accepts it', async () => {
    sendContactMessage.mockResolvedValueOnce(undefined);
    const response = await request(app.getHttpServer()).post('/contact').send(body).expect(201);
    expect(response.body.data).toEqual({ sent: true });
    expect(sendContactMessage).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid input without sending', async () => {
    await request(app.getHttpServer()).post('/contact').send({ ...body, email: 'bad', message: '' }).expect(400);
    expect(sendContactMessage).toHaveBeenCalledTimes(1);
  });

  it('reports provider failure and does not claim success', async () => {
    sendContactMessage.mockRejectedValueOnce(new ServiceUnavailableException('No disponible'));
    const response = await request(app.getHttpServer()).post('/contact').send(body).expect(503);
    expect(response.body.success).toBe(false);
  });
  it('limits repeated public submissions', async () => {
    await request(app.getHttpServer()).post('/contact').send(body).expect(429);
  });

});
