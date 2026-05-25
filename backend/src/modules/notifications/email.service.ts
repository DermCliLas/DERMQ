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

  // ─── PLANTILLA 2: ALERTA DE NUEVA CITA (DOCTORA) ──────────────────────────
  async sendNewAppointmentAlert(appointment: any) {
    const { patient, service, date, notes } = appointment;
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

    const subject = `Nueva Cita Programada: ${patient.firstName} ${patient.lastName} - ${service.name}`;

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
            <td align="center" style="padding: 30px; background-color: #014d4e; color: #ffffff;">
              <span style="font-size: 20px; font-weight: bold; letter-spacing: 1px;">DERMQ PANEL MÉDICO</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h3 style="margin-top: 0; color: #014d4e; font-size: 20px; font-weight: bold;">Estimada Dra. Marcela Leyva,</h3>
              <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">
                Se ha agendado una nueva cita en su agenda clínica a través de la plataforma en línea. A continuación los detalles del paciente:
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7fafc; border-radius: 12px; margin: 20px 0; padding: 20px; font-size: 14px; color: #2d3748; line-height: 1.6;">
                <tr>
                  <td><strong>Paciente:</strong></td>
                  <td>${patient.firstName} ${patient.lastName}</td>
                </tr>
                <tr>
                  <td><strong>DNI / Contacto:</strong></td>
                  <td>${patient.dni || 'No provisto'} / ${patient.phone || 'No provisto'}</td>
                </tr>
                <tr>
                  <td><strong>Tratamiento:</strong></td>
                  <td style="color: #014d4e; font-weight: bold;">${service.name}</td>
                </tr>
                <tr>
                  <td><strong>Fecha y Hora:</strong></td>
                  <td>${dateFormatted} a las ${timeFormatted}</td>
                </tr>
                <tr>
                  <td><strong>Notas del Paciente:</strong></td>
                  <td><em>${notes || 'Ninguna nota ingresada.'}</em></td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center;">
                Esta cita ya ha sido insertada y sincronizada de manera automática en su Google Calendar de DERMQ.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Enviamos la alerta al correo de la doctora (dermatologiaclinicaylasersac@gmail.com)
    return this.sendEmail(
      'dermatologiaclinicaylasersac@gmail.com',
      subject,
      html,
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
