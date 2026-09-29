import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../notifications/email.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentReminderService {
  private readonly logger = new Logger(AppointmentReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Cron Job ejecutado cada hora para enviar recordatorios a pacientes
   * con citas confirmadas en las próximas 24 horas.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleUpcomingAppointmentReminders(): Promise<number> {
    this.logger.log('Iniciando verificación de recordatorios de citas automáticos...');

    const now = new Date();
    // Ventana de las próximas 24 horas
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      const appointments = await this.prisma.appointment.findMany({
        where: {
          status: AppointmentStatus.CONFIRMED,
          reminderSent: false,
          date: {
            gte: now,
            lte: next24Hours,
          },
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
          branch: true,
        },
      });

      if (appointments.length === 0) {
        this.logger.log('No hay citas pendientes de recordatorio en las próximas 24 horas.');
        return 0;
      }

      this.logger.log(`Se encontraron ${appointments.length} citas para enviar recordatorio.`);
      let sentCount = 0;

      for (const apt of appointments) {
        if (!apt.patient?.email) {
          this.logger.warn(`Cita ${apt.id} no tiene email de paciente asociado. Saltando.`);
          continue;
        }

        try {
          await this.emailService.sendAppointmentReminder(apt);
          await this.prisma.appointment.update({
            where: { id: apt.id },
            data: { reminderSent: true },
          });
          this.logger.log(`Recordatorio enviado a ${apt.patient.email} para cita ${apt.id}`);
          sentCount++;
        } catch (err: any) {
          this.logger.error(`Error enviando recordatorio a ${apt.patient.email}: ${err.message}`);
        }
      }

      return sentCount;
    } catch (error: any) {
      this.logger.error(`Error en verificación de recordatorios: ${error.message}`);
      return 0;
    }
  }
}
