import { AppointmentsService } from './appointments.service';
import { AppointmentTimeValidator } from './validators/appointment-time.validator';
import { BadRequestException } from '@nestjs/common';
import { Role, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AppointmentsService & TimeValidator', () => {
  let service: AppointmentsService;
  let timeValidator: AppointmentTimeValidator;
  let mockPrisma: any;
  let mockGoogleCalendar: any;
  let mockEmail: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      service: {
        findUnique: jest.fn(),
      },
      appointment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(mockPrisma)),
    };

    mockGoogleCalendar = {
      listEvents: jest.fn().mockResolvedValue([]),
    };

    mockEmail = {
      sendAppointmentConfirmation: jest.fn().mockResolvedValue(true),
      sendNewAppointmentAlert: jest.fn().mockResolvedValue(true),
      sendAppointmentPendingPatient: jest.fn().mockResolvedValue(true),
      sendAppointmentReminder: jest.fn().mockResolvedValue(true),
      sendAppointmentCancelled: jest.fn().mockResolvedValue(true),
      sendAppointmentRescheduled: jest.fn().mockResolvedValue(true),
    };

    timeValidator = new AppointmentTimeValidator(mockPrisma);
    service = new AppointmentsService(
      mockPrisma,
      timeValidator,
      mockGoogleCalendar,
      mockEmail,
    );
  });

  describe('AppointmentTimeValidator Business Rules', () => {
    it('should reject Sunday appointments (Clinic closed)', async () => {
      // Find a Sunday date
      const sunday = new Date('2026-10-04T10:00:00-05:00'); // Sunday Oct 4, 2026
      const isAvailable = await timeValidator.isWithinBusinessHours(sunday);
      expect(isAvailable).toBe(false);
    });

    it('should reject appointments outside operating hours (e.g. 5:00 AM)', async () => {
      const earlyMorning = new Date('2026-10-05T05:00:00-05:00'); // Monday Oct 5, 2026 5 AM
      const isAvailable = await timeValidator.isWithinBusinessHours(earlyMorning);
      expect(isAvailable).toBe(false);
    });

    it('should accept valid weekday appointment at 11:00 AM', async () => {
      const validTime = new Date('2026-10-05T11:00:00-05:00'); // Monday Oct 5, 2026 11 AM
      const isAvailable = await timeValidator.isWithinBusinessHours(validTime);
      expect(isAvailable).toBe(true);
    });

    it('should reject overlapping doctor appointments', async () => {
      const doctorId = 'doc-123';
      const existingDate = new Date('2026-10-05T10:00:00.000Z');

      mockPrisma.appointment.findMany.mockResolvedValue([
        {
          id: 'app-existing',
          doctorId,
          date: existingDate,
          service: { durationMin: 60 }, // 10:00 to 11:00
        },
      ]);

      // Attempting to book at 10:30 (overlap)
      const overlappingDate = new Date('2026-10-05T10:30:00.000Z');
      const isAvailable = await timeValidator.isDoctorAvailable(
        doctorId,
        overlappingDate,
        30,
      );

      expect(isAvailable).toBe(false);
    });
  });

  describe('Reservation regression checks', () => {
    it('includes arrived appointments when checking for overlaps', async () => {
      mockPrisma.appointment.findMany.mockResolvedValue([{
        id: 'arrived', date: new Date('2027-01-11T16:00:00Z'),
        service: { durationMin: 30 },
      }]);
      expect(await timeValidator.isDoctorAvailable('doc', new Date('2027-01-11T16:00:00Z'), 30)).toBe(false);
      expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ status: { in: ['PENDING', 'CONFIRMED', 'ARRIVED'] } }),
      }));
    });

    it('calculates Lima business hours independently of server timezone', async () => {
      expect(await timeValidator.isWithinBusinessHours(new Date('2027-01-11T13:00:00Z'), 30)).toBe(true);
      expect(await timeValidator.isWithinBusinessHours(new Date('2027-01-11T12:30:00Z'), 30)).toBe(false);
      expect(await timeValidator.isWithinBusinessHours(new Date('2027-01-11T23:30:00Z'), 30)).toBe(true);
    });

    it('does not let a guest reuse any existing user by email or DNI', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ id: 'existing' });
      await expect(service.createGuest({ email: 'Existing@Example.com', firstName: 'A', lastName: 'B', dni: '11111111', doctorId: 'doc', serviceId: 'svc', date: '2027-01-11T16:00:00Z' })).rejects.toThrow('Inicia sesión o contacta');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { OR: [ { email: { equals: 'existing@example.com', mode: 'insensitive' } }, { dni: '11111111' } ] } }));
    });

    it('returns only minimal appointment details to a new guest', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ id: 'new-patient' });
      jest.spyOn(service, 'create').mockResolvedValue({ id: 'appointment', date: new Date('2027-01-11T16:00:00Z'), status: AppointmentStatus.PENDING, patient: { phone: 'private' }, doctor: { email: 'private' } });
      const result = await service.createGuest({ email: 'new@example.com', firstName: 'A', lastName: 'B', doctorId: 'doc', serviceId: 'svc', date: '2027-01-11T16:00:00Z' });
      expect(result).toEqual({ id: 'appointment', date: new Date('2027-01-11T16:00:00Z'), status: AppointmentStatus.PENDING });
    });

    it('cleans up a newly created guest account if booking fails', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ id: 'new-patient' });
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException('Horario ocupado'));
      await expect(service.createGuest({ email: 'new@example.com', firstName: 'A', lastName: 'B', doctorId: 'doc', serviceId: 'svc', date: '2027-01-11T16:00:00Z' })).rejects.toThrow('Horario ocupado');
      expect(mockPrisma.user.deleteMany).toHaveBeenCalled();
    });
  });

  describe('Guest Patient Creation Security', () => {
    it('should securely hash password when creating guest patient', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null); // Patient does not exist yet

      let savedPassword = '';
      mockPrisma.user.create.mockImplementation(async ({ data }: any) => {
        savedPassword = data.password;
        return {
          id: 'guest-1',
          ...data,
        };
      });

      // Mock dependencies for appointment creation
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: 'guest-1', role: Role.PATIENT }) // patient
        .mockResolvedValueOnce({
          id: 'doc-1',
          role: Role.DOCTOR,
          email: 'dr@dermq.com',
        }) // doctor
      mockPrisma.service.findUnique.mockResolvedValue({
        id: 'serv-1',
        durationMin: 30,
      });

      jest.spyOn(timeValidator, 'validateAppointmentTime').mockResolvedValue({
        isValid: true,
        errors: [],
      });
      jest.spyOn(timeValidator, 'isDoctorAvailable').mockResolvedValue(true);

      mockPrisma.appointment.create.mockResolvedValue({
        id: 'app-1',
        patientId: 'guest-1',
        doctorId: 'doc-1',
        serviceId: 'serv-1',
        date: new Date('2026-10-05T10:00:00Z'),
        status: AppointmentStatus.PENDING,
      });

      await service.createGuest({
        email: 'paciente.nuevo@gmail.com',
        firstName: 'Carlos',
        lastName: 'Mendoza',
        dni: '45678901',
        doctorId: 'doc-1',
        serviceId: 'serv-1',
        date: '2026-10-05T10:00:00Z',
      });

      // Verify that the password is a valid bcrypt hash, NOT plaintext
      expect(savedPassword).toBeDefined();
      expect(savedPassword.startsWith('$2b$')).toBe(true);
      expect(savedPassword.length).toBeGreaterThan(40);
    });
  });

  describe('Status Escalation Protection', () => {
    it('should force status PENDING when appointment is created by a PATIENT even if sending CONFIRMED', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: 'pat-1', role: Role.PATIENT })
        .mockResolvedValueOnce({
          id: 'doc-1',
          role: Role.DOCTOR,
          email: 'dr@test.com',
        });
      mockPrisma.service.findUnique.mockResolvedValue({
        id: 's1',
        durationMin: 30,
      });

      jest
        .spyOn(timeValidator, 'validateAppointmentTime')
        .mockResolvedValue({ isValid: true, errors: [] });
      jest.spyOn(timeValidator, 'isDoctorAvailable').mockResolvedValue(true);

      let createdStatus: any;
      mockPrisma.appointment.create.mockImplementation(({ data }: any) => {
        createdStatus = data.status;
        return { id: 'app-999', ...data };
      });

      await service.create(
        {
          patientId: 'pat-1',
          doctorId: 'doc-1',
          serviceId: 's1',
          date: new Date('2026-10-05T10:00:00Z'),
          status: AppointmentStatus.CONFIRMED, // Patient attempts to bypass and auto-confirm
        },
        'pat-1',
        Role.PATIENT,
      );

      expect(createdStatus).toBe(AppointmentStatus.PENDING);
    });

    it('should reject appointment if duration pushes end-time beyond business hours', async () => {
      // Monday at 19:30 with 60 minute duration ends at 20:30 (exceeds 20:00 closing)
      const lateDate = new Date('2026-10-05T19:30:00-05:00');
      const isAvailable = await timeValidator.isWithinBusinessHours(lateDate, 60);
      expect(isAvailable).toBe(false);
    });

    it('should pass transactional client tx into isDoctorAvailable during creation', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: 'pat-1', role: Role.PATIENT })
        .mockResolvedValueOnce({ id: 'doc-1', role: Role.DOCTOR, email: 'dr@test.com' });
      mockPrisma.service.findUnique.mockResolvedValue({ id: 's1', durationMin: 30 });

      jest.spyOn(timeValidator, 'validateAppointmentTime').mockResolvedValue({ isValid: true, errors: [] });
      const isDoctorAvailableSpy = jest.spyOn(timeValidator, 'isDoctorAvailable').mockResolvedValue(true);

      mockPrisma.appointment.create.mockResolvedValue({ id: 'app-1', status: AppointmentStatus.PENDING });

      await service.create(
        {
          patientId: 'pat-1',
          doctorId: 'doc-1',
          serviceId: 's1',
          date: new Date('2026-10-05T10:00:00Z'),
        },
        'pat-1',
        Role.PATIENT,
      );

      // Verify that isDoctorAvailable was called with tx inside $transaction
      expect(isDoctorAvailableSpy).toHaveBeenCalledWith(
        'doc-1',
        expect.any(Date),
        30,
        undefined,
        mockPrisma, // tx in mock is mockPrisma
      );
    });

    it('should forbid a DOCTOR from confirming or modifying appointments of another doctor', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'app-dr-a',
        doctorId: 'doctor-a-id',
        patientId: 'pat-1',
        status: AppointmentStatus.PENDING,
      });

      await expect(
        service.updateStatus(
          'app-dr-a',
          AppointmentStatus.CONFIRMED,
          'doctor-b-id', // Different doctor
          Role.DOCTOR,
        ),
      ).rejects.toThrow('No tienes permisos');
    });

    it('should forbid a PATIENT from changing status to CONFIRMED or ARRIVED', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'app-patient-1',
        doctorId: 'doctor-a-id',
        patientId: 'pat-1',
        status: AppointmentStatus.PENDING,
      });

      await expect(
        service.updateStatus(
          'app-patient-1',
          AppointmentStatus.CONFIRMED,
          'pat-1',
          Role.PATIENT,
        ),
      ).rejects.toThrow('únicamente tienen permitido cancelar');
    });

    it('should allow a PATIENT to cancel their own appointment', async () => {
      const mockApp = {
        id: 'app-patient-1',
        doctorId: 'doctor-a-id',
        patientId: 'pat-1',
        status: AppointmentStatus.PENDING,
      };
      mockPrisma.appointment.findUnique.mockResolvedValue(mockApp);
      mockPrisma.appointment.update.mockResolvedValue({
        ...mockApp,
        status: AppointmentStatus.CANCELLED,
      });

      const result = await service.updateStatus(
        'app-patient-1',
        AppointmentStatus.CANCELLED,
        'pat-1',
        Role.PATIENT,
      );

      expect(result.status).toBe(AppointmentStatus.CANCELLED);
    });
  });
});
