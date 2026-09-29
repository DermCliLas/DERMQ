import {
  Injectable,
  Logger,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { appConfig } from '../../config/app.config';

@Injectable()
export class IzipayService {
  private readonly logger = new Logger(IzipayService.name);
  private readonly shopId = appConfig.izipay.shopId;
  private readonly shopKey = appConfig.izipay.shopKey;
  private readonly hmacKey = appConfig.izipay.hmacKey;
  private readonly rawApiUrl = appConfig.izipay.apiUrl;

  private get apiUrl(): string {
    const defaultUrl =
      'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment';
    const url = this.rawApiUrl || defaultUrl;
    return url.replace('/api-payment/v4/', '/api-payment/V4/');
  }

  constructor() {
    if (!this.shopId || !this.shopKey) {
      if (process.env.NODE_ENV === 'production') {
        this.logger.error(
          'CRÍTICO: Izipay Shop ID o Shop Key no están configurados en entorno de PRODUCCIÓN.',
        );
      } else {
        this.logger.warn(
          'Izipay Shop ID or Shop Key are not defined.',
        );
      }
    }
    if (!this.hmacKey) {
      if (process.env.NODE_ENV === 'production') {
        this.logger.error(
          'CRÍTICO: IZIPAY_HMAC_KEY no está configurada en entorno de PRODUCCIÓN.',
        );
      } else {
        this.logger.warn(
          'IZIPAY_HMAC_KEY is not defined.',
        );
      }
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
    // 1. En producción, o cuando la simulación no esté explícitamente autorizada para pruebas: FAIL CLOSED
    if (!this.shopId || !this.shopKey) {
      if (
        process.env.NODE_ENV === 'production' ||
        process.env.ALLOW_PAYMENT_SIMULATION !== 'true'
      ) {
        this.logger.error(
          'Fallo crítico: Intento de generar formToken de Izipay sin credenciales configuradas en producción.',
        );
        throw new ServiceUnavailableException(
          'La pasarela de pagos no se encuentra disponible o no está configurada para procesar transacciones reales.',
        );
      }

      this.logger.log(
        `[SIMULACIÓN IZIPAY] Generando formToken simulado para monto: S/ ${amount} (${currency})`,
      );
      // Retornamos un token simulado únicamente en entorno de desarrollo/test local si está explícito
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
  verifyPayment(krAnswer: string | object, krHash: string): boolean {
    if (!this.hmacKey) {
      if (process.env.NODE_ENV === 'production') {
        this.logger.error('CRÍTICO: IZIPAY_HMAC_KEY no configurado en producción.');
        return false;
      }
      if (process.env.ALLOW_PAYMENT_SIMULATION !== 'true') {
        return false;
      }
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

      const calcBuffer = Buffer.from(calculatedHash, 'utf8');
      const recvBuffer = Buffer.from(krHash, 'utf8');
      const isValid =
        calcBuffer.length === recvBuffer.length &&
        crypto.timingSafeEqual(calcBuffer, recvBuffer);

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

  /**
   * Validates cryptographic signature, order status, paid amount, and currency.
   * Essential for preventing underpayment and payment tampering attacks in production.
   * Fails closed: Rejects transactions if security keys are missing or fields manipulated.
   */
  validatePaymentDetails(
    krAnswer: string | object,
    krHash: string,
    expectedAmountInCents: number,
    expectedCurrency = 'PEN',
    expectedOrderId?: string,
  ): { valid: boolean; reason?: string; transactionId?: string; amount?: number; orderId?: string } {
    if (!this.hmacKey) {
      if (process.env.NODE_ENV === 'production') {
        this.logger.error(
          'CRÍTICO: IZIPAY_HMAC_KEY no configurado en entorno de producción. Transacción bloqueada.',
        );
        return {
          valid: false,
          reason: 'Configuración de pasarela incompleta en producción. Pago rechazado por seguridad.',
        };
      }
      if (process.env.ALLOW_PAYMENT_SIMULATION !== 'true') {
        return {
          valid: false,
          reason: 'Firma HMAC de Izipay requerida para verificar el pago.',
        };
      }
      return {
        valid: true,
        transactionId: 'simulated-tx-' + Date.now(),
        amount: expectedAmountInCents,
      };
    }

    try {
      const rawAnswer =
        typeof krAnswer === 'object' ? JSON.stringify(krAnswer) : krAnswer;

      const calculatedHash = crypto
        .createHmac('sha256', this.hmacKey)
        .update(rawAnswer, 'utf8')
        .digest('hex');

      if (calculatedHash !== krHash) {
        this.logger.error(
          `Firma de pago inválida. Esperada: ${calculatedHash}, Recibida: ${krHash}`,
        );
        return {
          valid: false,
          reason: 'Firma criptográfica inválida (posible manipulación de datos)',
        };
      }

      const parsed =
        typeof krAnswer === 'string' ? JSON.parse(krAnswer) : krAnswer;

      // 1. Verificar estado de la orden
      const orderStatus =
        parsed.orderStatus || parsed.transactions?.[0]?.status;
      if (orderStatus !== 'PAID') {
        this.logger.error(`Estado de pago no completado: ${orderStatus}`);
        return {
          valid: false,
          reason: `Estado de pago no completado (${orderStatus})`,
        };
      }

      // 2. Verificar monto en céntimos (campo obligatorio e inmutable)
      const paidAmount =
        parsed.orderDetails?.orderTotalAmount ??
        parsed.transactions?.[0]?.amount;

      if (paidAmount === undefined || paidAmount === null || paidAmount !== expectedAmountInCents) {
        this.logger.error(
          `Monto pagado no coincide o no existe. Esperado: ${expectedAmountInCents} céntimos, Recibido: ${paidAmount}`,
        );
        return {
          valid: false,
          reason: `Discrepancia en monto pagado (Esperado: ${expectedAmountInCents}, Recibido: ${paidAmount})`,
        };
      }

      // 3. Verificar moneda (campo obligatorio)
      const paidCurrency =
        parsed.orderDetails?.orderCurrency ||
        parsed.transactions?.[0]?.currency;

      if (!paidCurrency || paidCurrency !== expectedCurrency) {
        this.logger.error(
          `Moneda de pago inválida o ausente. Esperada: ${expectedCurrency}, Recibida: ${paidCurrency}`,
        );
        return {
          valid: false,
          reason: `Moneda de pago incorrecta o no especificada (${paidCurrency})`,
        };
      }

      // 4. Validar obligatoriamente orderId
      const orderId = parsed.orderDetails?.orderId;
      if (!orderId || typeof orderId !== 'string' || orderId.trim().length === 0) {
        this.logger.error('Falta orderId en respuesta de Izipay o formato inválido');
        return {
          valid: false,
          reason: 'Identificador de orden (orderId) ausente o inválido en respuesta de Izipay',
        };
      }

      if (expectedOrderId && orderId !== expectedOrderId) {
        this.logger.error(
          `orderId no coincide con la orden esperada. Esperada: ${expectedOrderId}, Recibida: ${orderId}`,
        );
        return {
          valid: false,
          reason: `El pago recibido corresponde a otra orden (${orderId} != ${expectedOrderId})`,
        };
      }

      // 5. Validar obligatoriamente transactionId (uuid de transacción)
      const transactionId =
        parsed.transactions?.[0]?.uuid ||
        parsed.transactionDetails?.cardDetails?.transactionId;
      if (!transactionId || typeof transactionId !== 'string' || transactionId.trim().length === 0) {
        this.logger.error('Falta transactionId en respuesta de Izipay o formato inválido');
        return {
          valid: false,
          reason: 'Identificador de transacción (transactionId) ausente o inválido en respuesta de Izipay',
        };
      }

      return { valid: true, transactionId, amount: paidAmount, orderId };
    } catch (error) {
      this.logger.error(`Error procesando respuesta Izipay: ${error.message}`);
      return {
        valid: false,
        reason: `Error al procesar respuesta de pago: ${error.message}`,
      };
    }
  }
}
