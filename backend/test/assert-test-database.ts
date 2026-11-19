/** Integration tests create and delete data and must not contact production services. */
export function assertLocalTestDatabase(): void {
  let database: URL;
  try {
    database = new URL(process.env.DATABASE_URL || '');
  } catch {
    throw new Error('Las pruebas requieren DATABASE_URL de una base local de prueba.');
  }
  const localHosts = ['localhost', '127.0.0.1', '[::1]'];
  if (!localHosts.includes(database.hostname) || !database.pathname.toLowerCase().includes('test')) {
    throw new Error('Las pruebas requieren una base local cuyo nombre incluya test.');
  }
  if (process.env.RESEND_API_KEY || process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_PRIVATE_KEY || process.env.IZIPAY_SHOP_ID || process.env.IZIPAY_SHOP_KEY) {
    throw new Error('Las pruebas no permiten credenciales reales de correo, calendario o pagos.');
  }
  for (const [label, value] of [
    ['Supabase', process.env.SUPABASE_URL],
    ['NubeFact', process.env.NUBEFACT_API_URL || process.env.NUBEFACT_URL],
  ] as const) {
    if (value) {
      let hostname: string;
      try { hostname = new URL(value).hostname; } catch { throw new Error(`URL de ${label} inválida.`); }
      if (!localHosts.includes(hostname)) throw new Error(`Las pruebas no permiten ${label} remoto.`);
    } else if (label === 'NubeFact' && (process.env.NUBEFACT_API_TOKEN || process.env.NUBEFACT_TOKEN)) {
      throw new Error('Las pruebas no permiten un token de NubeFact sin URL local.');
    }
  }
}
