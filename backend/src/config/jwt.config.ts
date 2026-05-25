export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: 3600, // 1 hora en segundos
  refreshExpiresIn: 604800, // 7 días en segundos
};
