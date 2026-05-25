import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentTimeValidator } from './validators/appointment-time.validator';
import { GoogleCalendarService } from './google-calendar.service';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    AppointmentTimeValidator,
    GoogleCalendarService,
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
