const defaultSecret = 'dermq-super-secret-jwt-key-2026';
const secret = process.env.JWT_SECRET || defaultSecret;

if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
) {
  console.warn(
    '⚠️ ADVERTENCIA: En entorno de producción, se recomienda configurar JWT_SECRET con al menos 32 caracteres en el panel de variables de entorno de Render.',
  );
}

export const jwtConstants = {
  secret,
  expiresIn: 3600, // 1 hora en segundos
  refreshExpiresIn: 604800, // 7 días en segundos
};
