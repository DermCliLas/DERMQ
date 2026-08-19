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

      let data: any = {};
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        this.logger.warn(
          `NubeFact no devolvió un JSON válido (Status ${response.status}): ${responseText.substring(0, 100)}`,
        );
        return null;
      }

      if (!response.ok || data.errors) {
        this.logger.error(
          `NubeFact Error: ${JSON.stringify(data.errors || data)}`,
        );
        return null;
      }

      return {
        externalId: data.invoice_id,
        pdfUrl: data.enlace_del_pdf,
        xmlUrl: data.enlace_del_xml,
        documentNumber: `${data.serie}-${data.numero}`,
      };
    } catch (error) {
      this.logger.error(`Critical Billing Error: ${error.message}`);
      return null;
    }
  }

  async generateCreditNote(order: any, reason: string) {
    if (!this.token) {
      this.logger.warn('NubeFact Token not configured. Skipping credit note.');
      return null;
    }

    const isFactura = order.documentType === DocType.FACTURA;
    const parts = (order.documentNumber || '').split('-');
    const originalSeries = parts[0] || (isFactura ? 'F001' : 'B001');
    const originalNumber = parts[1] || order.id.split('-')[0].substring(0, 8);

    const items = order.items.map((item: any) => {
      const unitPrice = item.unitPrice;
      const igvRate = 0.18;
      const valorUnitario = unitPrice / (1 + igvRate);
      const igvTotal = unitPrice - valorUnitario;

      return {
        unidad_de_medida: 'NIU',
        codigo: item.productId || 'SERV',
        descripcion: item.product?.name || item.serviceName || 'Servicio Médico',
        cantidad: item.quantity,
        valor_unitario: valorUnitario,
        precio_unitario: unitPrice,
        subtotal: valorUnitario * item.quantity,
        tipo_de_igv: 1,
        igv: igvTotal * item.quantity,
        total: unitPrice * item.quantity,
      };
    });

    const payload = {
      operacion: 'generar_comprobante',
      tipo_de_comprobante: 3,
      serie: isFactura ? 'FC01' : 'BC01',
      numero: order.id.split('-')[0].substring(0, 8),
      sunat_transaction: 1,
      cliente_tipo_de_documento: isFactura ? 6 : 1,
      cliente_numero_de_documento: order.user?.dni || '00000000',
      cliente_denominacion: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Público General',
      cliente_direccion: 'Lima, Perú',
      cliente_email: order.user?.email || '',
      fecha_de_emision: new Date().toISOString().split('T')[0],
      moneda: 1,
      porcentaje_de_igv: 18.0,
      total_gravada: order.total / 1.18,
      total_inafecta: 0,
      total_exonerada: 0,
      total_gratuita: 0,
      total_otros_cargos: 0,
      total_igv: order.total - order.total / 1.18,
      total: order.total,
      tipo_de_nota_de_credito: 1,
      documento_que_se_modifica_tipo: isFactura ? 1 : 2,
      documento_que_se_modifica_serie: originalSeries,
      documento_que_se_modifica_numero: originalNumber,
      motivo: reason || 'Anulación de la operación',
      items: items,
      enviar_automaticamente_a_la_sunat: true,
      enviar_automaticamente_al_cliente: true,
    };

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
          `NubeFact Credit Note Error: ${JSON.stringify(data.errors || data)}`,
        );
        throw new InternalServerErrorException(
          data.errors || 'Error al emitir Nota de Crédito en NubeFact',
        );
      }

      return {
        externalId: data.invoice_id,
        pdfUrl: data.enlace_del_pdf,
        xmlUrl: data.enlace_del_xml,
        documentNumber: `${data.serie}-${data.numero}`,
      };
    } catch (error) {
      this.logger.error(`Critical Credit Note Error: ${error.message}`);
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
