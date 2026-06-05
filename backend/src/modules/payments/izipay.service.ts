import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { appConfig } from '../../config/app.config';

@Injectable()
export class IzipayService {
  private readonly logger = new Logger(IzipayService.name);
  private readonly shopId = appConfig.izipay.shopId;
  private readonly shopKey = appConfig.izipay.shopKey;
  private readonly hmacKey = appConfig.izipay.hmacKey;
  private readonly apiUrl = appConfig.izipay.apiUrl;

  constructor() {
    if (!this.shopId || !this.shopKey) {
      this.logger.warn(
        'Izipay Shop ID or Shop Key are not defined. Payments will run in simulation mode.',
      );
    }
    if (!this.hmacKey) {
      this.logger.warn(
        'IZIPAY_HMAC_KEY is not defined. Signature validation will be bypassed in development.',
      );
    }
  }

  /**
   * Generates a form token for the embedded checkout form.
   */
  async generateFormToken(
    amount: number,
    currency?: string,
    orderId?: string,
    email?: string,
  ): Promise<string> {
    // 1. Simulación si las credenciales no están presentes
    if (!this.shopId || !this.shopKey) {
      this.logger.log(
        `[SIMULACIÓN IZIPAY] Generando formToken simulado para monto: S/ ${amount} (${currency})`,
      );
      // Retornamos un token simulado para pruebas locales del programador
      return 'simulated-form-token-' + crypto.randomBytes(16).toString('hex');
    }

    try {
      const authString = Buffer.from(`${this.shopId}:${this.shopKey}`).toString(
        'base64',
      );

      // El API V4 requiere el monto en céntimos (ej. S/ 10.50 -> 1050)
      const amountInCents = Math.round(amount * 100);

      const payload = {
        amount: amountInCents,
        currency: currency || 'PEN',
        orderId: orderId || `ORD-${Date.now()}`,
        customer: {
          email: email || 'cliente@dermq.com',
        },
      };

      this.logger.log(`Solicitando formToken a Izipay API: ${this.apiUrl}`);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error API Izipay (${response.status}): ${errorText}`);
      }

      const responseData: any = await response.json();

      if (responseData.status !== 'SUCCESS') {
        throw new Error(
          `Error en respuesta de Izipay: ${JSON.stringify(responseData.answer || responseData)}`,
        );
      }

      const formToken = responseData.answer?.formToken;
      if (!formToken) {
        throw new Error('No se recibió el formToken en la respuesta de Izipay');
      }

      this.logger.log('formToken generado exitosamente con Izipay.');
      return formToken;
    } catch (error) {
      this.logger.error(
        `Error al generar formToken con Izipay: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Fallo al inicializar pago con Izipay: ${error.message}`,
      );
    }
  }

  /**
   * Verifies the authenticity of a payment response using HMAC-SHA256.
   */
  verifyPayment(krAnswer: string, krHash: string): boolean {
    if (!this.hmacKey) {
      this.logger.warn(
        'IZIPAY_HMAC_KEY no configurado. Permitiendo transacción por simulación.',
      );
      // Modo simulación local para no bloquear desarrollo
      return true;
    }

    try {
      // 1. Limpiar krAnswer por si es objeto o string
      const rawAnswer =
        typeof krAnswer === 'object' ? JSON.stringify(krAnswer) : krAnswer;

      // 2. Calcular firma HMAC-SHA256
      const calculatedHash = crypto
        .createHmac('sha256', this.hmacKey)
        .update(rawAnswer, 'utf8')
        .digest('hex');

      const isValid = calculatedHash === krHash;
      if (isValid) {
        this.logger.log('La firma del pago de Izipay es válida.');
      } else {
        this.logger.error(
          `Firma de pago inválida. Esperada: ${calculatedHash}, Recibida: ${krHash}`,
        );
      }
      return isValid;
    } catch (error) {
      this.logger.error(
        `Error durante la validación de firma de Izipay: ${error.message}`,
      );
      return false;
    }
  }
}
