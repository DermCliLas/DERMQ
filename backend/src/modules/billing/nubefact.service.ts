import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { appConfig } from '../../config/app.config';
import { DocType, Order, PaymentMethod } from '@prisma/client';

@Injectable()
export class NubeFactService {
  private readonly logger = new Logger(NubeFactService.name);
  private readonly apiUrl = appConfig.nubeFact.url;
  private readonly token = appConfig.nubeFact.token;

  async generateDocument(order: any) {
    if (!this.token) {
      this.logger.warn('NubeFact Token not configured. Skipping billing.');
      return null;
    }

    const payload = this.mapOrderToNubeFact(order);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token token="${this.token}"`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.errors) {
        this.logger.error(
          `NubeFact Error: ${JSON.stringify(data.errors || data)}`,
        );
        throw new InternalServerErrorException(
          data.errors || 'Error al comunicarse con NubeFact',
        );
      }

      return {
        externalId: data.invoice_id,
        pdfUrl: data.enlace_del_pdf,
        xmlUrl: data.enlace_del_xml,
        documentNumber: `${data.serie}-${data.numero}`,
      };
    } catch (error) {
      this.logger.error(`Critical Billing Error: ${error.message}`);
      throw error;
    }
  }

  private mapOrderToNubeFact(order: any) {
    const isFactura = order.documentType === DocType.FACTURA;

    // Mapeo de Items
    const items = order.items.map((item: any) => {
      const unitPrice = item.unitPrice;
      // Por defecto asumimos Gravado (18%) para productos y Estética,
      // y Exonerado (0%) para Clínica si el servicio lo indica.
      // Simplificación: Gravado 18% para todo inicialmente, ajustable por el usuario.
      const igvRate = 0.18;
      const valorUnitario = unitPrice / (1 + igvRate);
      const igvTotal = unitPrice - valorUnitario;

      return {
        unidad_de_medida: 'NIU', // Unidad estándar
        codigo: item.productId || 'SERV',
        descripcion:
          item.product?.name || item.serviceName || 'Servicio Médico',
        cantidad: item.quantity,
        valor_unitario: valorUnitario,
        precio_unitario: unitPrice,
        subtotal: valorUnitario * item.quantity,
        tipo_de_igv: 1, // 1 = Gravado - Operación Onerosa
        igv: igvTotal * item.quantity,
        total: unitPrice * item.quantity,
        anticipo_regularizacion: false,
        anticipo_documento_serie: '',
        anticipo_documento_numero: '',
      };
    });

    return {
      operacion: 'generar_comprobante',
      tipo_de_comprobante: isFactura ? 1 : 2,
      serie: isFactura ? 'F001' : 'B001',
      numero: order.id.split('-')[0].substring(0, 8), // Placeholder o correlativo interno
      sunat_transaction: 1, // Venta interna
      cliente_tipo_de_documento: isFactura ? 6 : 1, // 6=RUC, 1=DNI
      cliente_numero_de_documento: order.user?.dni || '00000000',
      cliente_denominacion:
        `${order.user?.firstName} ${order.user?.lastName}`.trim(),
      cliente_direccion: 'Lima, Perú',
      cliente_email: order.user?.email || '',
      fecha_de_emision: new Date().toISOString().split('T')[0],
      moneda: 1, // 1=Soles
      tipo_de_cambio: '',
      porcentaje_de_igv: 18.0,
      total_gravada: order.total / 1.18,
      total_inafecta: 0,
      total_exonerada: 0,
      total_gratuita: 0,
      total_otros_cargos: 0,
      total_detraccion: 0,
      total_igv: order.total - order.total / 1.18,
      total: order.total,
      items: items,
      enviar_automaticamente_a_la_sunat: true,
      enviar_automaticamente_al_cliente: true,
    };
  }
}
