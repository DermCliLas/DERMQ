import { EmailService } from './email.service';

describe('appointment emails', () => {
  it('formats the appointment time in Lima regardless of server timezone', async () => {
    const service = new EmailService();
    const send = jest.spyOn(service, 'sendEmail').mockResolvedValue({ id: 'test' });
    await service.sendAppointmentConfirmation({
      patient: { firstName: 'Paciente', lastName: 'Prueba', email: 'test@example.com' },
      doctor: { firstName: 'Doctor', lastName: 'Prueba' },
      service: { name: 'Consulta', durationMin: 30 },
      date: '2027-01-11T16:00:00.000Z',
    });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][2]).toContain('11:00');
    expect(send.mock.calls[0][2]).not.toContain('4:00 p');
  });
});
