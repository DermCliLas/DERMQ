import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentTimeValidator } from './validators/appointment-time.validator';
import { GoogleCalendarService } from './google-calendar.service';
import { EmailService } from '../notifications/email.service';
import { Role, AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private timeValidator: AppointmentTimeValidator,
    private googleCalendar: GoogleCalendarService,
    private emailService: EmailService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    userId: string,
    userRole: Role,
  ) {
    // Verificar que el paciente, doctor y servicio existan
    const [patient, doctor, service] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: createAppointmentDto.patientId },
      }),
      this.prisma.user.findUnique({
        where: { id: createAppointmentDto.doctorId },
      }),
      this.prisma.service.findUnique({
        where: { id: createAppointmentDto.serviceId },
      }),
    ]);

    if (!patient) {
      throw new NotFoundException(
        `Paciente con ID ${createAppointmentDto.patientId} no encontrado`,
      );
    }
    if (!doctor) {
      throw new NotFoundException(
        `Doctor con ID ${createAppointmentDto.doctorId} no encontrado`,
      );
    }
    if (!service) {
      throw new NotFoundException(
        `Servicio con ID ${createAppointmentDto.serviceId} no encontrado`,
      );
    }

    // Verificar que el doctor sea realmente un doctor
    if (doctor.role !== Role.DOCTOR) {
      throw new BadRequestException('El usuario especificado no es un doctor');
    }

    // Validar horario de la cita
    const validation = await this.timeValidator.validateAppointmentTime(
      createAppointmentDto.doctorId,
      createAppointmentDto.date,
      service.durationMin,
    );

    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // Validar disponibilidad en Google Calendar
    if (doctor.email) {
      const isBusyInGoogle = await this.isBusyInGoogleCalendar(
        doctor.email,
        createAppointmentDto.date,
        service.durationMin,
      );
      if (isBusyInGoogle) {
        throw new BadRequestException(
          'El doctor no está disponible en ese horario en su Google Calendar',
        );
      }
    }

    // Crear la cita
    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: createAppointmentDto.patientId,
        doctorId: createAppointmentDto.doctorId,
        serviceId: createAppointmentDto.serviceId,
        date: createAppointmentDto.date,
        notes: createAppointmentDto.notes,
        status: createAppointmentDto.status,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            durationMin: true,
          },
        },
      },
    });

    // ─── GOOGLE CALENDAR SYNC ON INITIAL CREATION ────────────────────────────
    try {
      if (appointment.status === AppointmentStatus.CONFIRMED) {
        const googleEventId = await this.googleCalendar.createEvent(appointment);
        if (googleEventId) {
          await this.prisma.appointment.update({
            where: { id: appointment.id },
            data: { googleEventId },
          });
          appointment.googleEventId = googleEventId;
        }
        
        // ─── EMAIL NOTIFICATIONS ──────────────────────────────────────────────
        this.emailService.sendAppointmentConfirmation(appointment).catch((err) =>
          console.error('Error sending appointment confirmation email:', err),
        );
        this.emailService.sendNewAppointmentAlert(appointment).catch((err) =>
          console.error('Error sending appointment alert email to doctor:', err),
        );
      }
    } catch (error) {
      console.error('Error synchronizing with Google Calendar on create:', error);
    }

    return appointment;
  }

  async createGuest(data: any) {
    // Check if patient exists by email or DNI
    let patient = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, ...(data.dni ? [{ dni: data.dni }] : [])],
      },
    });

    if (!patient) {
      patient = await this.prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          dni: data.dni || null,
          phone: data.phone || null,
          password: 'Guest_' + Math.random().toString(36).substring(7),
          role: Role.PATIENT,
        },
      });
    }

    return this.create(
      {
        patientId: patient.id,
        doctorId: data.doctorId,
        serviceId: data.serviceId,
        date: new Date(data.date),
        notes: data.notes,
        status: AppointmentStatus.PENDING,
      },
      patient.id,
      Role.PATIENT,
    );
  }

  async findAll(
    filters: {
      patientId?: string;
      doctorId?: string;
      status?: AppointmentStatus;
      startDate?: Date;
      endDate?: Date;
    },
    page: number = 1,
    limit: number = 10,
    userRole: Role,
    userId: string,
  ) {
    const skip = (page - 1) * limit;

    // Construir condiciones de filtro
    const where: any = {};

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if ((filters as any).branchId) {
      where.branchId = (filters as any).branchId;
    }

    if (filters.doctorId) {
      where.doctorId = filters.doctorId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    // Restricciones de acceso según rol
    if (userRole === Role.PATIENT) {
      where.patientId = userId;
    } else if (userRole === Role.DOCTOR) {
      where.doctorId = userId;
    }
    // ADMIN y RECEPTION pueden ver todas las citas

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialty: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              durationMin: true,
            },
          },
        },
        orderBy: { date: 'asc' },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            durationMin: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
            isPaid: true,
            paymentMethod: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Verificar permisos de acceso
    this.checkAppointmentAccess(appointment, userId, userRole);

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    userId: string,
    userRole: Role,
  ) {
    // Verificar que la cita exista
    const existingAppointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });

    if (!existingAppointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Verificar permisos de acceso
    this.checkAppointmentAccess(existingAppointment, userId, userRole);

    // No permitir modificar citas completadas o canceladas
    if (
      existingAppointment.status === AppointmentStatus.COMPLETED ||
      existingAppointment.status === AppointmentStatus.CANCELLED
    ) {
      throw new ForbiddenException(
        'No se puede modificar una cita completada o cancelada',
      );
    }

    // Si se está cambiando la fecha o el doctor, validar disponibilidad
    if (updateAppointmentDto.date || updateAppointmentDto.doctorId) {
      const doctorId =
        updateAppointmentDto.doctorId || existingAppointment.doctorId;
      const date = updateAppointmentDto.date || existingAppointment.date;
      const duration = existingAppointment.service.durationMin;

      const validation = await this.timeValidator.validateAppointmentTime(
        doctorId,
        date,
        duration,
        id,
      );

      if (!validation.isValid) {
        throw new BadRequestException(validation.errors.join(', '));
      }
    }

    // Actualizar la cita
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            durationMin: true,
          },
        },
      },
    });

    // ─── GOOGLE CALENDAR SYNC ON RESCHEDULE ──────────────────────────────────
    if (existingAppointment.googleEventId) {
      try {
        const doctorChanged =
          updateAppointmentDto.doctorId &&
          updateAppointmentDto.doctorId !== existingAppointment.doctorId;

        if (doctorChanged) {
          // 1. Eliminar el evento del doctor anterior
          const oldDoctor = await this.prisma.user.findUnique({
            where: { id: existingAppointment.doctorId },
            select: { email: true },
          });
          if (oldDoctor) {
            await this.googleCalendar.deleteEvent(
              oldDoctor.email,
              existingAppointment.googleEventId,
            );
          }

          // 2. Crear el evento en el nuevo doctor
          const newEventId = await this.googleCalendar.createEvent(updatedAppointment);
          if (newEventId) {
            await this.prisma.appointment.update({
              where: { id },
              data: { googleEventId: newEventId },
            });
            updatedAppointment.googleEventId = newEventId;
          }
        } else {
          // Actualizar el evento existente en el mismo doctor
          await this.googleCalendar.updateEvent(
            updatedAppointment,
            existingAppointment.googleEventId,
          );
        }
      } catch (error) {
        console.error('Error updating Google Calendar event on reschedule:', error);
      }
    }

    return updatedAppointment;
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    userId: string,
    userRole: Role,
  ) {
    // Verificar que la cita exista
    const existingAppointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { select: { email: true } },
      },
    });

    if (!existingAppointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Verificar permisos de acceso
    this.checkAppointmentAccess(existingAppointment, userId, userRole);

    // Validar transiciones de estado
    const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.PENDING]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
      ],
      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.ARRIVED,
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
      ],
      [AppointmentStatus.ARRIVED]: [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
      ],
      [AppointmentStatus.COMPLETED]: [],
      [AppointmentStatus.CANCELLED]: [],
    };

    const allowedTransitions = validTransitions[existingAppointment.status];
    if (!allowedTransitions.includes(status)) {
      throw new BadRequestException(
        `No se puede cambiar el estado de ${existingAppointment.status} a ${status}`,
      );
    }

    // Actualizar el estado
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            specialty: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            durationMin: true,
          },
        },
      },
    });

    // ─── GOOGLE CALENDAR SYNC ───────────────────────────────────────────────
    try {
      if (status === AppointmentStatus.CONFIRMED) {
        const googleEventId =
          await this.googleCalendar.createEvent(updatedAppointment);
        if (googleEventId) {
          await this.prisma.appointment.update({
            where: { id },
            data: { googleEventId },
          });
        }
        
        // ─── EMAIL NOTIFICATIONS ──────────────────────────────────────────────
        this.emailService.sendAppointmentConfirmation(updatedAppointment).catch((err) =>
          console.error('Error sending appointment confirmation email:', err),
        );
        this.emailService.sendNewAppointmentAlert(updatedAppointment).catch((err) =>
          console.error('Error sending appointment alert email to doctor:', err),
        );
      } else if (
        status === AppointmentStatus.CANCELLED &&
        updatedAppointment.googleEventId
      ) {
        await this.googleCalendar.deleteEvent(
          (updatedAppointment.doctor as any).email,
          updatedAppointment.googleEventId,
        );
        await this.prisma.appointment.update({
          where: { id },
          data: { googleEventId: null },
        });
      }
    } catch (error) {
      console.error('Error synchronizing with Google Calendar:', error);
      // No lanzamos error para no bloquear el cambio de estado si Google falla
    }

    return updatedAppointment;
  }

  async remove(id: string, userId: string, userRole: Role) {
    // Verificar que la cita exista
    const existingAppointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Verificar permisos de acceso
    this.checkAppointmentAccess(existingAppointment, userId, userRole);

    // Solo permitir eliminar citas pendientes
    if (existingAppointment.status !== AppointmentStatus.PENDING) {
      throw new ForbiddenException('Solo se pueden eliminar citas pendientes');
    }

    // ─── GOOGLE CALENDAR SYNC ON REMOVE ──────────────────────────────────────
    if (existingAppointment.googleEventId) {
      try {
        const doctor = await this.prisma.user.findUnique({
          where: { id: existingAppointment.doctorId },
          select: { email: true },
        });
        if (doctor) {
          await this.googleCalendar.deleteEvent(
            doctor.email,
            existingAppointment.googleEventId,
          );
        }
      } catch (error) {
        console.error('Error deleting Google Calendar event on remove:', error);
      }
    }

    await this.prisma.appointment.delete({
      where: { id },
    });

    return { message: 'Cita eliminada correctamente' };
  }

  async getAvailableSlots(doctorId: string, date: Date) {
    // Verificar que el doctor exista y sea un doctor
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId, role: Role.DOCTOR },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor con ID ${doctorId} no encontrado`);
    }

    // Obtener servicios disponibles del doctor (todos los servicios por ahora)
    const services = await this.prisma.service.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        durationMin: true,
        price: true,
      },
    });

    // Obtener citas del doctor para ese día en base de datos local
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Obtener eventos de Google Calendar
    let googleEvents: any[] = [];
    if (doctor.email) {
      try {
        googleEvents = await this.googleCalendar.listEvents(doctor.email, startOfDay, endOfDay);
      } catch (err) {
        console.warn('Could not list google calendar events for slots:', err);
      }
    }

    // Generar slots disponibles
    const slots = [];
    const startHour = 8; // 8:00 AM
    const endHour = 20; // 8:00 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Slots cada 30 minutos
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        // Verificar si el slot está dentro del horario de negocio
        if (!(await this.timeValidator.isWithinBusinessHours(slotTime))) {
          continue;
        }

        // Verificar disponibilidad para cada servicio
        const availableServices = [];

        for (const service of services) {
          // 1. Chequear localmente
          const isLocalAvailable = await this.timeValidator.isDoctorAvailable(
            doctorId,
            slotTime,
            service.durationMin,
          );

          if (!isLocalAvailable) continue;

          // 2. Chequear en Google Calendar
          let isGoogleAvailable = true;
          const slotStart = slotTime.getTime();
          const slotEnd = slotStart + service.durationMin * 60000;

          for (const event of googleEvents) {
            if (!event.start?.dateTime || !event.end?.dateTime) continue;

            const eventStart = new Date(event.start.dateTime).getTime();
            const eventEnd = new Date(event.end.dateTime).getTime();

            // Si se solapa, no está disponible
            if (slotStart < eventEnd && slotEnd > eventStart) {
              isGoogleAvailable = false;
              break;
            }
          }

          if (isGoogleAvailable) {
            availableServices.push({
              serviceId: service.id,
              serviceName: service.name,
              duration: service.durationMin,
              price: service.price,
            });
          }
        }

        if (availableServices.length > 0) {
          slots.push({
            time: slotTime,
            availableServices,
          });
        }
      }
    }

    return {
      doctor: {
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        specialty: doctor.specialty,
      },
      date,
      slots,
    };
  }

  private checkAppointmentAccess(
    appointment: any,
    userId: string,
    userRole: Role,
  ) {
    // ADMIN y RECEPTION tienen acceso completo
    if (userRole === Role.ADMIN || userRole === Role.RECEPTION) {
      return;
    }

    // DOCTOR solo puede acceder a sus propias citas
    if (userRole === Role.DOCTOR && appointment.doctorId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a esta cita',
      );
    }

    // PATIENT solo puede acceder a sus propias citas
    if (userRole === Role.PATIENT && appointment.patientId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a esta cita',
      );
    }
  }

  private async isBusyInGoogleCalendar(
    doctorEmail: string,
    date: Date,
    durationMin: number,
  ): Promise<boolean> {
    try {
      const start = new Date(date);
      const end = new Date(start.getTime() + durationMin * 60000);

      // Obtener rango de todo el día para mayor eficiencia de red / paginación
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const events = await this.googleCalendar.listEvents(doctorEmail, startOfDay, endOfDay);
      
      const newStart = start.getTime();
      const newEnd = end.getTime();

      for (const event of events) {
        if (!event.start?.dateTime || !event.end?.dateTime) continue;

        const eventStart = new Date(event.start.dateTime).getTime();
        const eventEnd = new Date(event.end.dateTime).getTime();

        // Traslape
        if (newStart < eventEnd && newEnd > eventStart) {
          return true;
        }
      }
    } catch (error) {
      console.warn('Error checking google calendar busy status:', error);
    }
    return false;
  }
}
