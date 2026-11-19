import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ServiceUnavailableException } from '@nestjs/common';
import { ContactMessageDto } from './dto/contact-message.dto';
import { ContactController } from './contact.controller';
import { EmailService } from './email.service';

const valid = { firstName: 'Ana', lastName: 'Prueba', email: 'ana@example.com', phone: '', subject: 'consulta', message: 'Necesito información' };

describe('Contact form', () => {
  it('validates required values, length and recognized subjects', async () => {
    expect(await validate(plainToInstance(ContactMessageDto, valid))).toHaveLength(0);
    expect((await validate(plainToInstance(ContactMessageDto, { ...valid, email: 'bad', message: '  ', subject: 'fake' }))).length).toBeGreaterThan(0);
    expect((await validate(plainToInstance(ContactMessageDto, { ...valid, message: 'a'.repeat(3001) }))).length).toBeGreaterThan(0);
  });

  it('returns success only when the email service accepts the message', async () => {
    const email = { sendContactMessage: jest.fn().mockResolvedValue(undefined) };
    const controller = new ContactController(email as any);
    await expect(controller.send(plainToInstance(ContactMessageDto, valid))).resolves.toEqual({ sent: true });
    email.sendContactMessage.mockRejectedValue(new ServiceUnavailableException());
    await expect(controller.send(plainToInstance(ContactMessageDto, valid))).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('rejects missing provider and provider errors instead of simulating a successful send', async () => {
    const service = new EmailService();
    (service as any).resend = null;
    await expect(service.sendContactMessage(plainToInstance(ContactMessageDto, valid))).rejects.toBeInstanceOf(ServiceUnavailableException);
    (service as any).resend = { emails: { send: jest.fn().mockResolvedValue({ data: null, error: { message: 'failure' } }) } };
    await expect(service.sendContactMessage(plainToInstance(ContactMessageDto, valid))).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('sends to the configured clinic address with reply-to and escapes patient input', async () => {
    const service = new EmailService();
    const send = jest.fn().mockResolvedValue({ data: { id: 'local-test' }, error: null });
    (service as any).resend = { emails: { send } };
    const prior = process.env.CONTACT_EMAIL;
    process.env.CONTACT_EMAIL = 'clinic-test@example.com';
    try {
      await service.sendContactMessage(plainToInstance(ContactMessageDto, { ...valid, message: '<script>alert(1)</script>\nHola' }));
      const payload = send.mock.calls[0][0];
      expect(payload.to).toEqual(['clinic-test@example.com']);
      expect(payload.replyTo).toBe(valid.email);
      expect(payload.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;<br>Hola');
      expect(payload.html).not.toContain('<script>');
    } finally {
      if (prior === undefined) delete process.env.CONTACT_EMAIL; else process.env.CONTACT_EMAIL = prior;
    }
  });
});
