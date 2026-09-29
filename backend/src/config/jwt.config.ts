const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.JWT_SECRET ||
    process.env.JWT_SECRET === 'your-secret-key-change-in-production' ||
    process.env.JWT_SECRET.length < 32)
) {
  throw new Error(
    'CRÍTICO DE SEGURIDAD: En entorno de producción, JWT_SECRET debe estar configurado y tener al menos 32 caracteres.',
  );
}

export const jwtConstants = {
  secret,
  expiresIn: 3600, // 1 hora en segundos
  refreshExpiresIn: 604800, // 7 días en segundos
};
