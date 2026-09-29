import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { appConfig } from '../../config/app.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private readonly fromEmail = appConfig.resend.fromEmail;

  constructor() {
    const apiKey = appConfig.resend.apiKey;
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend service initialized successfully.');
    } else {
      this.logger.warn(
        'RESEND_API_KEY is not defined. Email service will run in simulation mode.',
      );
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.warn(
        `[SIMULACIÓN DE CORREO] Enviando a: ${to} | Asunto: "${subject}" | Llave API no configurada.`,
      );
      return { id: 'simulated-id' };
    }

    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: subject,
        html: html,
      });

      if (response.error) {
        this.logger.error(`Resend Error: ${JSON.stringify(response.error)}`);
        return null;
      }

      this.logger.log(
        `Correo enviado exitosamente a ${to}. ID Evento: ${response.data?.id}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error al enviar correo vía Resend: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  // ─── PLANTILLA 1: CONFIRMACIÓN DE CITA (PACIENTE) ─────────────────────────
  async sendAppointmentConfirmation(appointment: any) {
    const { patient, doctor, service, date } = appointment;
    const appointmentDate = new Date(date);
    const dateFormatted = appointmentDate.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormatted = appointmentDate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const subject = `Confirmación de Cita: ${service.name} - DERMQ`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #1a1c1e;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <!-- Encabezado Premium -->
          <tr>
            <td align="center" style="padding: 40px 0; background: linear-gradient(135deg, #014d4e 0%, #72c1c1 100%);">
              <span style="font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">DERMQ</span>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 600; letter-spacing: 1px;">CLÍNICA & ESTÉTICA DERMATOLÓGICA</p>
            </td>
          </tr>
          
          <!-- Contenido -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin-top: 0; color: #014d4e; font-size: 24px; font-weight: 800; text-align: center;">¡Tu Cita está Programada!</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #4a5568; text-align: center;">
                Hola <strong>${patient.firstName}</strong>, hemos registrado y confirmado correctamente tu cita médica en nuestra plataforma.
              </p>
              
              <!-- Tarjeta de Detalles Glassmorphism -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7fafc; border-radius: 16px; margin: 30px 0; padding: 25px;">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <span style="font-size: 12px; color: #718096; font-weight: bold; text-transform: uppercase;">Tratamiento</span><br/>
                    <strong style="font-size: 18px; color: #014d4e;">${service.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 15px;">
                    <span style="font-size: 12px; color: #718096; font-weight: bold; text-transform: uppercase;">Especialista</span><br/>
                    <strong style="font-size: 16px; color: #2d3748;">Dra. Marcela Leyva</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 15px;">
                    <span style="font-size: 12px; color: #718096; font-weight: bold; text-transform: uppercase;">Fecha y Hora</span><br/>
                    <strong style="font-size: 16px; color: #2d3748;">${dateFormatted} a las ${timeFormatted}</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size: 12px; color: #718096; font-weight: bold; text-transform: uppercase;">Ubicación</span><br/>
                    <strong style="font-size: 14px; color: #2d3748;">Av. Javier Prado Este 1234, San Isidro, Lima</strong>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #718096; line-height: 1.5; text-align: center;">
                Hemos enviado automáticamente esta cita a tu calendario de Google para que recibas notificaciones automáticas en tu celular.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #f7fafc; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0;">
              <p style="margin: 0 0 5px 0;">DERMQ Clínica Dermatológica © 2026</p>
              <p style="margin: 0;">Si necesitas reprogramar o cancelar, por favor contáctanos al 01-4445566 con al menos 24 horas de anticipación.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    return this.sendEmail(patient.email, subject, html);
  }

  // ─── PLANTILLA 2: SOLICITUD WEB RECIBIDA (PACIENTE - PENDIENTE) ───────────
  async sendAppointmentPendingPatient(appointment: any) {
    const { patient, doctor, service, date } = appointment;
    const appointmentDate = new Date(date);
    const dateFormatted = appointmentDate.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormatted = appointmentDate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const subject = `Solicitud de Cita Recibida: ${service.name} - DERMQ`;
    const clinicAddress =
      appointment.branch?.address ||
      'Av. José Gálvez Barrenechea 127, Of. 604, San Isidro, Lima';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #1a1c1e;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td align="center" style="padding: 35px 0; background: linear-gradient(135deg, #014d4e 0%, #72c1c1 100%);">
              <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">DERMQ</span>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.85); font-weight: 600; letter-spacing: 1px;">CLÍNICA & ESTÉTICA DERMATOLÓGICA</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 30px;">
              <div style="text-align: center; margin-bottom: 25px;">
                <span style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 6px 16px; rounded-pill: true; border-radius: 50px;">Solicitud en Revisión</span>
              </div>
              <h2 style="margin-top: 0; color: #014d4e; font-size: 22px; font-weight: 800; text-align: center;">¡Hemos recibido tu solicitud de cita!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #4a5568; text-align: center;">
                Hola <strong>${patient.firstName}</strong>, tu solicitud para agendar una cita en DERMQ ha sido recibida con éxito. Nuestro equipo de recepción la validará a la brevedad.
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7fafc; border-radius: 16px; margin: 25px 0; padding: 22px; border: 1px solid #edf2f7;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-size: 11px; color: #718096; font-weight: bold; text-transform: uppercase;">Tratamiento Solicitado</span><br/>
                    <strong style="font-size: 16px; color: #014d4e;">${service.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-size: 11px; color: #718096; font-weight: bold; text-transform: uppercase;">Fecha y Hora Solicitada</span><br/>
                    <strong style="font-size: 15px; color: #2d3748;">${dateFormatted} a las ${timeFormatted}</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size: 11px; color: #718096; font-weight: bold; text-transform: uppercase;">Sede</span><br/>
                    <strong style="font-size: 14px; color: #2d3748;">${clinicAddress}</strong>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center; margin: 0;">
                Tan pronto como recepción apruebe tu cita, recibirás un correo de confirmación final con todos los detalles.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 25px; background-color: #f7fafc; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0;">
              <p style="margin: 0 0 4px 0;">DERMQ Clínica Dermatológica © 2026</p>
              <p style="margin: 0;">Consultas: +51 996 235 890 • citas@draleyva.com</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    return this.sendEmail(patient.email, subject, html);
  }

  // ─── PLANTILLA 3: ALERTA DE NUEVA CITA O SOLICITUD (DOCTORA) ──────────────
  async sendNewAppointmentAlert(appointment: any, isPending: boolean = false) {
    const { patient, doctor, service, date, notes } = appointment;
    const appointmentDate = new Date(date);
    const dateFormatted = appointmentDate.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormatted = appointmentDate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const statusBadge = isPending
      ? 'SOLICITUD WEB PENDIENTE DE CONFIRMACIÓN'
      : 'CITA CONFIRMADA EN AGENDA';
    const badgeBg = isPending ? '#d97706' : '#014d4e';

    const subject = isPending
      ? `🔔 Nueva Solicitud de Cita Web: ${patient.firstName} ${patient.lastName} - ${service.name}`
      : `✅ Cita Confirmada: ${patient.firstName} ${patient.lastName} - ${service.name}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f6; color: #1a1c1e;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td align="center" style="padding: 28px; background-color: ${badgeBg}; color: #ffffff;">
              <span style="font-size: 18px; font-weight: bold; letter-spacing: 1px;">DERMQ PANEL MÉDICO</span>
              <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">${statusBadge}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 30px;">
              <h3 style="margin-top: 0; color: #014d4e; font-size: 20px; font-weight: bold;">
                Estimada ${doctor ? 'Dra. ' + doctor.firstName + ' ' + doctor.lastName : 'Dra. Marcela Leyva'},
              </h3>
              <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">
                ${
                  isPending
                    ? 'Un paciente ha solicitado una nueva cita en la plataforma web que se encuentra en espera de confirmación:'
                    : 'Se ha agendado y confirmado una cita médica en su agenda clínica:'
                }
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7fafc; border-radius: 12px; margin: 20px 0; padding: 20px; font-size: 14px; color: #2d3748; line-height: 1.6; border: 1px solid #edf2f7;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Paciente:</strong></td>
                  <td style="padding: 4px 0;">${patient.firstName} ${patient.lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>DNI / Documento:</strong></td>
                  <td style="padding: 4px 0;">${patient.dni || 'No provisto'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Teléfono:</strong></td>
                  <td style="padding: 4px 0;">${patient.phone || 'No provisto'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Email:</strong></td>
                  <td style="padding: 4px 0;">${patient.email}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Tratamiento:</strong></td>
                  <td style="padding: 4px 0; color: #014d4e; font-weight: bold;">${service.name} (S/ ${Number(service.price).toFixed(2)})</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Fecha y Hora:</strong></td>
                  <td style="padding: 4px 0; font-weight: bold;">${dateFormatted} a las ${timeFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Notas del Paciente:</strong></td>
                  <td style="padding: 4px 0;"><em>${notes || 'Ninguna nota ingresada.'}</em></td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center; margin: 0;">
                ${
                  isPending
                    ? 'Recepción puede aprobar esta cita directamente en el panel administrativo.'
                    : 'Esta cita se encuentra sincronizada automáticamente en su Google Calendar de DERMQ.'
                }
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px; background-color: #f7fafc; border-top: 1px solid #edf2f7; font-size: 11px; color: #a0aec0;">
              DERMQ Sede San Isidro • Sistema de Alertas Automáticas
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Enviar a la doctora titular (o email del doctor si difiere)
    const targetEmail = doctor?.email || 'dermatologiaclinicaylasersac@gmail.com';
    return this.sendEmail(targetEmail, subject, html);
  }

  // ─── PLANTILLA 4: RECORDATORIO AUTOMÁTICO 24H ANTES (PACIENTE) ────────────
  async sendAppointmentReminder(appointment: any) {
    const { patient, doctor, service, date } = appointment;
    const appointmentDate = new Date(date);
    const dateFormatted = appointmentDate.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormatted = appointmentDate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const subject = `⏰ Recordatorio de Cita Mañana: ${service.name} a las ${timeFormatted} - DERMQ`;
    const clinicAddress =
      appointment.branch?.address ||
      'Av. José Gálvez Barrenechea 127, Of. 604, San Isidro, Lima';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #1a1c1e;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td align="center" style="padding: 35px 0; background: linear-gradient(135deg, #014d4e 0%, #72c1c1 100%);">
              <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">DERMQ</span>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.85); font-weight: 600; letter-spacing: 1px;">RECORDATORIO DE ATENCIÓN</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin-top: 0; color: #014d4e; font-size: 22px; font-weight: 800; text-align: center;">¡Te esperamos mañana!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #4a5568; text-align: center;">
                Hola <strong>${patient.firstName}</strong>, te recordamos que tienes una cita programada para el día de mañana en nuestra clínica dermatológica.
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7fafc; border-radius: 16px; margin: 25px 0; padding: 22px; border: 1px solid #edf2f7;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-size: 11px; color: #718096; font-weight: bold; text-transform: uppercase;">Tratamiento</span><br/>
                    <strong style="font-size: 16px; color: #014d4e;">${service.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-size: 11px; color: #718096; font-weight: bold; text-transform: uppercase;">Especialista</span><br/>
                    <strong style="font-size: 15px; color: #2d3748;">${doctor ? 'Dra. ' + doctor.firstName + ' ' + doctor.lastName : 'Dra. Marcela Leyva'}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-size: 11px; color: #718096; font-weight: bold; text-transform: uppercase;">Hora de tu Cita</span><br/>
                    <strong style="font-size: 17px; color: #014d4e;">${timeFormatted}</strong> (${dateFormatted})
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size: 11px; color: #718096; font-weight: bold; text-transform: uppercase;">Dirección</span><br/>
                    <strong style="font-size: 14px; color: #2d3748;">${clinicAddress}</strong>
                  </td>
                </tr>
              </table>

              <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 13px; color: #065f46; line-height: 1.5;">
                  <strong>Recomendación:</strong> Te sugerimos llegar con 10 minutos de anticipación y traer tu documento de identidad (DNI o Carnet de Extranjería).
                </p>
              </div>

              <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center; margin: 0;">
                Si necesitas reprogramar con urgencia, por favor comunícate a nuestro WhatsApp o teléfono al <strong>+51 996 235 890</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 25px; background-color: #f7fafc; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0;">
              <p style="margin: 0 0 4px 0;">DERMQ Clínica Dermatológica • San Isidro, Lima</p>
              <p style="margin: 0;">citas@draleyva.com</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    return this.sendEmail(patient.email, subject, html);
  }

  // ─── PLANTILLA 5: AVISO DE CANCELACIÓN (PACIENTE & DOCTORA) ───────────────
  async sendAppointmentCancelled(appointment: any, reason?: string) {
    const { patient, doctor, service, date } = appointment;
    const appointmentDate = new Date(date);
    const dateFormatted = appointmentDate.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormatted = appointmentDate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const subject = `Cita Cancelada: ${service.name} - DERMQ`;

    const htmlPatient = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #1a1c1e;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td align="center" style="padding: 30px 0; background-color: #64748b;">
              <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 2px;">DERMQ</span>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.85); font-weight: 600;">AVISO DE CANCELACIÓN</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin-top: 0; color: #1e293b; font-size: 20px; font-weight: 800; text-align: center;">Cita Cancelada</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #4a5568; text-align: center;">
                Hola <strong>${patient.firstName}</strong>, te informamos que la cita médica programada ha sido cancelada.
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 14px; margin: 20px 0; padding: 20px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6;">
                <tr>
                  <td><strong>Tratamiento:</strong></td>
                  <td>${service.name}</td>
                </tr>
                <tr>
                  <td><strong>Fecha original:</strong></td>
                  <td>${dateFormatted} a las ${timeFormatted}</td>
                </tr>
                ${reason ? `<tr><td><strong>Motivo:</strong></td><td>${reason}</td></tr>` : ''}
              </table>

              <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center;">
                Si deseas volver a agendar en un nuevo horario, puedes hacerlo directamente en nuestro sitio web o contactando a recepción al <strong>+51 996 235 890</strong>.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Enviar al paciente
    await this.sendEmail(patient.email, subject, htmlPatient);

    // Enviar alerta a la doctora
    const htmlDoctor = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1c1e;">
        <h3 style="color: #b91c1c;">Cita Cancelada en Agenda</h3>
        <p>Se ha cancelado la siguiente cita en el sistema:</p>
        <ul>
          <li><strong>Paciente:</strong> ${patient.firstName} ${patient.lastName} (${patient.email})</li>
          <li><strong>Tratamiento:</strong> ${service.name}</li>
          <li><strong>Fecha:</strong> ${dateFormatted} a las ${timeFormatted}</li>
          ${reason ? `<li><strong>Motivo:</strong> ${reason}</li>` : ''}
        </ul>
      </div>
    `;
    const doctorEmail = doctor?.email || 'dermatologiaclinicaylasersac@gmail.com';
    return this.sendEmail(doctorEmail, `[Cancelada] Cita: ${patient.firstName} ${patient.lastName} - ${service.name}`, htmlDoctor);
  }

  // ─── PLANTILLA 6: AVISO DE REPROGRAMACIÓN (PACIENTE & DOCTORA) ─────────────
  async sendAppointmentRescheduled(appointment: any, oldDateFormatted: string) {
    const { patient, doctor, service, date } = appointment;
    const appointmentDate = new Date(date);
    const dateFormatted = appointmentDate.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeFormatted = appointmentDate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const subject = `🔄 Cita Reprogramada: ${service.name} - DERMQ`;
    const clinicAddress =
      appointment.branch?.address ||
      'Av. José Gálvez Barrenechea 127, Of. 604, San Isidro, Lima';

    const htmlPatient = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f7f6; color: #1a1c1e;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td align="center" style="padding: 35px 0; background: linear-gradient(135deg, #0284c7 0%, #014d4e 100%);">
              <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 2px;">DERMQ</span>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.85); font-weight: 600;">ACTUALIZACIÓN DE HORARIO</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin-top: 0; color: #014d4e; font-size: 22px; font-weight: 800; text-align: center;">Tu cita ha sido reprogramada</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #4a5568; text-align: center;">
                Hola <strong>${patient.firstName}</strong>, confirmamos el cambio de fecha/hora de tu cita médica.
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0fdf4; border-radius: 16px; margin: 25px 0; padding: 22px; border: 1px solid #bbf7d0;">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <span style="font-size: 11px; color: #15803d; font-weight: bold; text-transform: uppercase;">Nueva Fecha y Hora</span><br/>
                    <strong style="font-size: 18px; color: #14532d;">${dateFormatted} a las ${timeFormatted}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;">
                    <span style="font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">Horario Anterior</span><br/>
                    <span style="font-size: 13px; color: #64748b; text-decoration: line-through;">${oldDateFormatted}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;">
                    <span style="font-size: 11px; color: #15803d; font-weight: bold; text-transform: uppercase;">Especialista & Tratamiento</span><br/>
                    <strong style="font-size: 15px; color: #14532d;">${doctor ? 'Dra. ' + doctor.firstName + ' ' + doctor.lastName : 'Dra. Marcela Leyva'} • ${service.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size: 11px; color: #15803d; font-weight: bold; text-transform: uppercase;">Dirección</span><br/>
                    <strong style="font-size: 14px; color: #14532d;">${clinicAddress}</strong>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center; margin: 0;">
                El evento en Google Calendar también se ha actualizado con el nuevo horario.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await this.sendEmail(patient.email, subject, htmlPatient);

    const doctorEmail = doctor?.email || 'dermatologiaclinicaylasersac@gmail.com';
    return this.sendEmail(
      doctorEmail,
      `[Reprogramada] Cita: ${patient.firstName} ${patient.lastName} - ${dateFormatted} a las ${timeFormatted}`,
      `<p>La cita de <strong>${patient.firstName} ${patient.lastName}</strong> para <strong>${service.name}</strong> se ha reprogramado al <strong>${dateFormatted} a las ${timeFormatted}</strong> (anteriormente: ${oldDateFormatted}).</p>`,
    );
  }


  // ─── PLANTILLA 3: RECIBO DE PAGO & FACTURA (PACIENTE) ─────────────────────
  async sendOrderInvoice(order: any, billingResult: any) {
    const { user, items, total } = order;
    const subject = `Comprobante de Pago Electrónico: ${billingResult.documentNumber} - DERMQ`;

    const itemsRows = items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; font-size: 14px;">
          ${item.product?.name || item.serviceName || 'Servicio DERMQ'}
        </td>
        <td align="center" style="padding: 12px; border-bottom: 1px solid #edf2f7; font-size: 14px;">
          ${item.quantity}
        </td>
        <td align="right" style="padding: 12px; border-bottom: 1px solid #edf2f7; font-size: 14px; font-weight: bold; color: #2d3748;">
          S/ ${item.unitPrice.toFixed(2)}
        </td>
      </tr>
    `,
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f6; color: #1a1c1e;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <!-- Encabezado -->
          <tr>
            <td align="center" style="padding: 40px 30px; background: linear-gradient(135deg, #014d4e 0%, #72c1c1 100%); color: #ffffff;">
              <span style="font-size: 26px; font-weight: 800; letter-spacing: 2px;">DERMQ</span>
              <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">COMPROBANTE ELECTRÓNICO DE PAGO</p>
            </td>
          </tr>
          
          <!-- Mensaje de Agradecimiento -->
          <tr>
            <td style="padding: 40px 30px 20px 30px; text-align: center;">
              <h2 style="margin-top: 0; color: #014d4e; font-size: 22px; font-weight: 800;">¡Gracias por tu compra!</h2>
              <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">
                Hola <strong>${user?.firstName || 'Paciente'}</strong>, confirmamos el pago de tu transacción. Hemos emitido de manera electrónica tu comprobante de pago SUNAT.
              </p>
            </td>
          </tr>

          <!-- Documentos Adjuntos de NubeFact -->
          <tr>
            <td align="center" style="padding: 0 30px 20px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" style="background-color: #e6f7f7; border-radius: 16px; width: 100%; padding: 20px; border: 1px solid #72c1c1;">
                <tr>
                  <td align="center">
                    <span style="font-size: 12px; color: #014d4e; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Comprobante Emitido</span><br/>
                    <strong style="font-size: 20px; color: #014d4e; display: block; margin-top: 5px;">${billingResult.documentNumber}</strong>
                    
                    <div style="margin-top: 15px;">
                      <a href="${billingResult.pdfUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #014d4e; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: bold; margin-right: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
                        Descargar PDF
                      </a>
                      <a href="${billingResult.xmlUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #f7fafc; color: #014d4e; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: bold; border: 1px solid #cbd5e0;">
                        Descargar XML
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Detalle de Compra -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <h4 style="margin: 20px 0 10px 0; color: #2d3748; font-size: 16px; border-bottom: 2px solid #edf2f7; padding-bottom: 8px;">Detalle del Pedido</h4>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f7fafc;">
                    <th align="left" style="padding: 10px; font-size: 12px; color: #718096; text-transform: uppercase;">Descripción</th>
                    <th align="center" style="padding: 10px; font-size: 12px; color: #718096; text-transform: uppercase;">Cant.</th>
                    <th align="right" style="padding: 10px; font-size: 12px; color: #718096; text-transform: uppercase;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                  <tr>
                    <td colspan="2" align="right" style="padding: 15px 12px 0 12px; font-weight: bold; font-size: 16px; color: #4a5568;">Total Pagado:</td>
                    <td align="right" style="padding: 15px 12px 0 12px; font-weight: 900; font-size: 20px; color: #014d4e;">S/ ${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #f7fafc; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0;">
              <p style="margin: 0 0 5px 0;">DERMQ S.A.C. • Av. Javier Prado Este 1234, San Isidro, Lima</p>
              <p style="margin: 0;">Ante cualquier duda o consulta sobre tu comprobante electrónico, escríbenos a citas@dermq.com</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    return this.sendEmail(user?.email || 'dermatologiaclinicaylasersac@gmail.com', subject, html);
  }
}
