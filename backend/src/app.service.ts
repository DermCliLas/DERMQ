import { Injectable } from '@nestjs/common';
import { appConfig } from './config/app.config';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getHealth() {
    const url = appConfig.nubeFact.url;
    const token = appConfig.nubeFact.token;
    let nubefactStatus = 'NOT_CONFIGURED';
    let details: any = null;

    if (token && url && !url.includes('your-nubefact')) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token token="${token}"`,
          },
          body: JSON.stringify({
            operacion: 'consultar_comprobante',
            tipo_de_comprobante: 2,
            serie: appConfig.nubeFact.seriesBoleta || 'B001',
            numero: 1,
          }),
        });
        const data = await res.json().catch(() => null);
        if (res.status === 401 || res.status === 403) {
          nubefactStatus = 'INVALID_TOKEN_OR_UNAUTHORIZED';
        } else if (res.status === 404) {
          nubefactStatus = 'INVALID_URL_404';
        } else {
          nubefactStatus = 'CONNECTED';
          details = {
            nubefactCode: data?.codigo,
            nubefactResponse: data?.errors || 'OK',
            seriesBoleta: appConfig.nubeFact.seriesBoleta,
            seriesFactura: appConfig.nubeFact.seriesFactura,
          };
        }
      } catch (e: any) {
        nubefactStatus = `NETWORK_ERROR: ${e.message}`;
      }
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      nubefact: {
        status: nubefactStatus,
        apiUrlConfigured: Boolean(url),
        tokenConfigured: Boolean(token),
        seriesBoleta: appConfig.nubeFact.seriesBoleta,
        seriesFactura: appConfig.nubeFact.seriesFactura,
        details,
      },
      resend: {
        configured: Boolean(appConfig.resend.apiKey),
        fromEmail: appConfig.resend.fromEmail,
        status: appConfig.resend.apiKey ? 'ACTIVE' : 'SIMULATION_MODE',
      },
    };
  }
}

