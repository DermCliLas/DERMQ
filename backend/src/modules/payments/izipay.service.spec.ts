import { IzipayService } from './izipay.service';
import * as crypto from 'crypto';

describe('IzipayService', () => {
  let service: IzipayService;
  const mockHmacKey = 'test_secret_hmac_key_123456';

  beforeEach(() => {
    // Override hmacKey directly for deterministic testing
    service = new IzipayService();
    (service as any).hmacKey = mockHmacKey;
  });

  describe('Signature and Verification', () => {
    it('should verify a valid HMAC-SHA256 signature', () => {
      const payload = {
        orderStatus: 'PAID',
        orderDetails: {
          orderTotalAmount: 15000,
          orderCurrency: 'PEN',
          orderId: 'ORD-1234',
        },
      };
      const rawPayload = JSON.stringify(payload);
      const validHash = crypto
        .createHmac('sha256', mockHmacKey)
        .update(rawPayload, 'utf8')
        .digest('hex');

      const isValid = service.verifyPayment(payload, validHash);
      expect(isValid).toBe(true);
    });

    it('should reject a tampered signature', () => {
      const payload = {
        orderStatus: 'PAID',
        orderDetails: { orderTotalAmount: 15000, orderCurrency: 'PEN' },
      };
      const isValid = service.verifyPayment(payload, 'forged_or_invalid_hash');
      expect(isValid).toBe(false);
    });
  });

  describe('validatePaymentDetails (Financial Anti-Tampering)', () => {
    it('should approve valid payment matching expected amount and currency', () => {
      const payload = {
        orderStatus: 'PAID',
        orderDetails: {
          orderTotalAmount: 25000, // S/ 250.00
          orderCurrency: 'PEN',
          orderId: 'ORD-999',
        },
        transactions: [
          {
            uuid: 'tx-uuid-777',
            status: 'PAID',
            amount: 25000,
            currency: 'PEN',
          },
        ],
      };
      const rawPayload = JSON.stringify(payload);
      const validHash = crypto
        .createHmac('sha256', mockHmacKey)
        .update(rawPayload, 'utf8')
        .digest('hex');

      const result = service.validatePaymentDetails(
        rawPayload,
        validHash,
        25000,
        'PEN',
      );

      expect(result.valid).toBe(true);
      expect(result.transactionId).toBe('tx-uuid-777');
      expect(result.amount).toBe(25000);
    });

    it('should reject if payment is not marked as PAID (e.g. UNPAID or ERROR)', () => {
      const payload = {
        orderStatus: 'UNPAID',
        orderDetails: {
          orderTotalAmount: 25000,
          orderCurrency: 'PEN',
        },
      };
      const rawPayload = JSON.stringify(payload);
      const validHash = crypto
        .createHmac('sha256', mockHmacKey)
        .update(rawPayload, 'utf8')
        .digest('hex');

      const result = service.validatePaymentDetails(
        rawPayload,
        validHash,
        25000,
        'PEN',
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Estado de pago no completado');
    });

    it('should reject underpayment attack (amount tampering)', () => {
      const payload = {
        orderStatus: 'PAID',
        orderDetails: {
          orderTotalAmount: 100, // Attacker paid 1 Sol (100 cents) instead of 250 Sol (25000 cents)
          orderCurrency: 'PEN',
        },
      };
      const rawPayload = JSON.stringify(payload);
      const validHash = crypto
        .createHmac('sha256', mockHmacKey)
        .update(rawPayload, 'utf8')
        .digest('hex');

      const result = service.validatePaymentDetails(
        rawPayload,
        validHash,
        25000, // Expected 25000 cents
        'PEN',
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Discrepancia en monto pagado');
    });

    it('should reject currency mismatch attack', () => {
      const payload = {
        orderStatus: 'PAID',
        orderDetails: {
          orderTotalAmount: 25000,
          orderCurrency: 'USD', // Paid in wrong currency
        },
      };
      const rawPayload = JSON.stringify(payload);
      const validHash = crypto
        .createHmac('sha256', mockHmacKey)
        .update(rawPayload, 'utf8')
        .digest('hex');

      const result = service.validatePaymentDetails(
        rawPayload,
        validHash,
        25000,
        'PEN', // Expected PEN
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Moneda de pago incorrecta');
    });

    it('should fail-closed in production if HMAC key is missing', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      (service as any).hmacKey = undefined;

      const result = service.validatePaymentDetails('{}', 'some-hash', 1000, 'PEN');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('producción');

      process.env.NODE_ENV = originalEnv;
    });

    it('should reject if paid amount or currency is completely omitted from response', () => {
      const payload = {
        orderStatus: 'PAID',
        // orderDetails and amount missing
      };
      const rawPayload = JSON.stringify(payload);
      const validHash = crypto
        .createHmac('sha256', mockHmacKey)
        .update(rawPayload, 'utf8')
        .digest('hex');

      const result = service.validatePaymentDetails(
        rawPayload,
        validHash,
        25000,
        'PEN',
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Discrepancia');
    });
  });
});
