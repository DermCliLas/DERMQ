import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { GoogleWebhookController } from './google-webhook.controller';
import { AppointmentTimeValidator } from './validators/appointment-time.validator';
import { GoogleCalendarService } from './google-calendar.service';

@Module({
  controllers: [AppointmentsController, GoogleWebhookController],
  providers: [
    AppointmentsService,
    AppointmentTimeValidator,
    GoogleCalendarService,
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
