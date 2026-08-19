export const appConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        'http://localhost:3001',
        'https://draleyva.com',
        'https://www.draleyva.com',
      ],
  rateLimit: {
    ttl: 60, // 1 minute
    limit: 100, // 100 requests per minute
  },
  googleCalendar: {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  nubeFact: {
    url: process.env.NUBEFACT_API_URL || process.env.NUBEFACT_URL || 'https://api.nubefact.com/v1/ventas',
    token: process.env.NUBEFACT_API_TOKEN || process.env.NUBEFACT_TOKEN,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'DERMQ <onboarding@resend.dev>',
  },
  izipay: {
    shopId: process.env.IZIPAY_SHOP_ID,
    shopKey: process.env.IZIPAY_SHOP_KEY,
    publicKey: process.env.IZIPAY_PUBLIC_KEY,
    hmacKey: process.env.IZIPAY_HMAC_KEY,
    apiUrl: process.env.IZIPAY_API_URL || 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    bucket: process.env.SUPABASE_BUCKET || 'dermq',
  },
};

