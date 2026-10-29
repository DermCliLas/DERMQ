require('dotenv').config();

async function testConnection() {
  const url = process.env.NUBEFACT_API_URL;
  const token = process.env.NUBEFACT_API_TOKEN;
  const serieBoleta = process.env.NUBEFACT_SERIES_BOLETA || 'B001';

  console.log('--- TEST DE CONEXIÓN NUBEFACT ---');
  console.log(`URL: ${url}`);
  console.log(`Token: ${token ? token.substring(0, 8) + '...' + token.substring(token.length - 6) : 'NO CONFIGURADO'}`);
  console.log(`Serie Boleta: ${serieBoleta}`);
  console.log('---------------------------------');

  if (!url || !token) {
    console.error('❌ Falta configurar NUBEFACT_API_URL o NUBEFACT_API_TOKEN en el archivo .env');
    process.exit(1);
  }

  try {
    console.log('📡 Enviando consulta de prueba no destructiva a NubeFact...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token token="${token}"`,
      },
      body: JSON.stringify({
        operacion: 'consultar_comprobante',
        tipo_de_comprobante: 2, // Boleta
        serie: serieBoleta,
        numero: 1,
      }),
    });

    const status = response.status;
    const data = await response.json().catch(() => null);

    console.log(`Respuesta HTTP: ${status}`);

    if (status === 401 || status === 403) {
      console.error('❌ Error de Autenticación: El Token no es válido para esta URL/RUC.');
      console.log('Respuesta:', data);
      return;
    }

    if (status === 404) {
      console.error('❌ Error 404: La URL de la API es incorrecta (verifica el UUID final).');
      return;
    }

    // Si status es 200 y dice "errors: no existe" significa que las credenciales son 100% VÁLIDAS
    console.log('✅ ¡CONEXIÓN EXITOSA CON NUBEFACT!');
    console.log('Detalle recibido de NubeFact:');
    console.log(data);
    if (data && data.errors) {
      console.log('ℹ️ Nota: Es normal que indique que el comprobante 1 no existe si aún no emitieron ninguno.');
    }
  } catch (err) {
    console.error('❌ Error de red o al conectar con NubeFact:', err.message);
  }
}

testConnection();
