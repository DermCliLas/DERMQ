import { Controller, Post, Headers, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleCalendarService } from './google-calendar.service';
import { AppointmentStatus } from '@prisma/client';

@Controller('appointments')
export class GoogleWebhookController {
  private readonly logger = new Logger(GoogleWebhookController.name);

  constructor(
    private prisma: PrismaService,
    private googleCalendar: GoogleCalendarService,
  ) {}

  @Public()
  @Post('google-webhook')
  @HttpCode(HttpStatus.OK)
  async handleGoogleWebhook(
    @Headers('x-goog-channel-id') channelId: string,
    @Headers('x-goog-resource-id') resourceId: string,
    @Headers('x-goog-resource-state') state: string,
  ) {
    this.logger.log(`Received Google Webhook: channelId=${channelId}, state=${state}`);

    // Google sends 'sync' as the initial confirmation channel state
    if (state === 'sync') {
      this.logger.log(`Google Webhook channel confirmed: ${channelId}`);
      return { success: true };
    }

    if (!channelId) {
      this.logger.warn('Google webhook call missing channel-id header');
      return { success: false };
    }

    // 1. Buscar al doctor con este googleSyncToken (channelId)
    const doctor = await this.prisma.user.findFirst({
      where: { googleSyncToken: channelId },
    });

    if (!doctor) {
      this.logger.warn(`No doctor found matching googleSyncToken channel: ${channelId}`);
      return { success: false };
    }

    // 2. Traer las citas locales activas del doctor para comparar (rango de 7 días antes y 30 días después)
    const now = new Date();
    const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const localAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        googleEventId: { not: null },
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.ARRIVED] },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (localAppointments.length === 0) {
      this.logger.log(`No active local appointments with googleEventId found for doctor ${doctor.email} in range.`);
      return { success: true };
    }

    // 3. Obtener los eventos correspondientes de Google Calendar
    const googleEvents = await this.googleCalendar.listEvents(doctor.email, startDate, endDate);
    
    // 4. Comparar y sincronizar cambios
    for (const apt of localAppointments) {
      const gEvent = googleEvents.find(e => e.id === apt.googleEventId);

      if (!gEvent || gEvent.status === 'cancelled') {
        // Cita eliminada en Google -> Cancelar localmente
        this.logger.log(`Event ${apt.googleEventId} deleted or cancelled in Google Calendar. Cancelling local appointment ${apt.id}`);
        await this.prisma.appointment.update({
          where: { id: apt.id },
          data: { status: AppointmentStatus.CANCELLED, googleEventId: null },
        });
      } else {
        // Cita existente -> Verificar si cambió de fecha/hora
        const gStart = gEvent.start?.dateTime ? new Date(gEvent.start.dateTime) : null;
        if (gStart && gStart.getTime() !== new Date(apt.date).getTime()) {
          this.logger.log(`Event ${apt.googleEventId} rescheduled in Google Calendar to ${gStart.toISOString()}. Updating local appointment ${apt.id}`);
          await this.prisma.appointment.update({
            where: { id: apt.id },
            data: { date: gStart },
          });
        }
      }
    }

    return { success: true };
  }
}
