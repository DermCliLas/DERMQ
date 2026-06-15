import { Injectable, Logger } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { appConfig } from '../../config/app.config';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar: calendar_v3.Calendar;

  constructor() {
    this.initCalendar();
  }

  private initCalendar() {
    const { clientEmail, privateKey } = appConfig.googleCalendar;

    if (!clientEmail || !privateKey) {
      this.logger.warn(
        'Google Calendar credentials are not fully configured. Calendar sync will be disabled.',
      );
      return;
    }

    try {
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      this.calendar = google.calendar({ version: 'v3', auth });
      this.logger.log('Google Calendar service initialized successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Google Calendar service',
        error.stack,
      );
    }
  }

  async createEvent(appointment: any): Promise<string | null> {
    if (!this.calendar) return null;

    try {
      const { patient, doctor, service, date } = appointment;
      const startDateTime = new Date(date);
      const endDateTime = new Date(
        startDateTime.getTime() + service.durationMin * 60000,
      );

      const event: calendar_v3.Schema$Event = {
        summary: `Cita: ${patient.firstName} ${patient.lastName} - ${service.name}`,
        description: `Servicio: ${service.name}\nPaciente: ${patient.firstName} ${patient.lastName}\nEmail: ${patient.email}\nTeléfono: ${patient.phone || 'N/A'}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Lima',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Lima',
        },
        attendees: [
          { email: patient.email }
        ],
        // We use the doctor's email as the calendar ID.
        // Note: The doctor must share their calendar with the Service Account email.
      };

      const response = await this.calendar.events.insert({
        calendarId: doctor.email,
        requestBody: event,
        sendUpdates: 'all',
      });

      this.logger.log(
        `Event created in Google Calendar: ${response.data.id} for calendar ${doctor.email}`,
      );
      return response.data.id || null;
    } catch (error) {
      this.logger.error(
        `Error creating Google Calendar event: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<boolean> {
    if (!this.calendar || !eventId) return false;

    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
        sendUpdates: 'all',
      });
      this.logger.log(
        `Event ${eventId} deleted from Google Calendar ${calendarId}`,
      );
      return true;
    } catch (error) {
      this.logger.warn(
        `Could not delete Google Calendar event ${eventId}: ${error.message}`,
      );
      return false;
    }
  }

  async updateEvent(appointment: any, eventId: string): Promise<boolean> {
    if (!this.calendar || !eventId) return false;

    try {
      const { patient, doctor, service, date } = appointment;
      const startDateTime = new Date(date);
      const endDateTime = new Date(
        startDateTime.getTime() + service.durationMin * 60000,
      );

      const event: calendar_v3.Schema$Event = {
        summary: `ACTUALIZADO: ${patient.firstName} ${patient.lastName} - ${service.name}`,
        description: `Servicio: ${service.name}\nPaciente: ${patient.firstName} ${patient.lastName}\nEmail: ${patient.email}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Lima',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Lima',
        },
        attendees: [
          { email: patient.email }
        ],
      };

      await this.calendar.events.update({
        calendarId: doctor.email,
        eventId,
        requestBody: event,
        sendUpdates: 'all',
      });

      this.logger.log(
        `Event ${eventId} updated in Google Calendar for ${doctor.email}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error updating Google Calendar event: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  async listEvents(calendarId: string, start: Date, end: Date): Promise<calendar_v3.Schema$Event[]> {
    if (!this.calendar) return [];

    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      this.logger.error(
        `Error listing events for calendar ${calendarId}: ${error.message}`,
      );
      return [];
    }
  }

  async watchCalendar(calendarId: string, channelId: string, webhookUrl: string): Promise<any> {
    if (!this.calendar) return null;

    try {
      const response = await this.calendar.events.watch({
        calendarId,
        requestBody: {
          id: channelId,
          type: 'web_hook',
          address: webhookUrl,
        },
      });

      this.logger.log(`Calendar watch set up for ${calendarId} on channel ${channelId}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error watching calendar ${calendarId}: ${error.message}`,
      );
      return null;
    }
  }

  async stopWatch(id: string, resourceId: string): Promise<boolean> {
    if (!this.calendar) return false;

    try {
      await this.calendar.channels.stop({
        requestBody: {
          id,
          resourceId,
        },
      });
      this.logger.log(`Calendar watch stopped for channel ${id}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error stopping watch for channel ${id}: ${error.message}`,
      );
      return false;
    }
  }
}
