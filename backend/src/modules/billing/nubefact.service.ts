import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { appConfig } from '../../config/app.config';
import { DocType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NubeFactService {
  private readonly logger = new Logger(NubeFactService.name);
  private readonly apiUrl = appConfig.nubeFact.url;
  private readonly token = appConfig.nubeFact.token;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verifica si NubeFact está configurado con credenciales válidas
   * y no con valores por defecto o placeholders.
   */
  private isConfigured(): boolean {
    return Boolean(
      this.token &&
        this.token !== 'your-nubefact-token' &&
        this.token.trim().length > 0 &&
        this.apiUrl &&
        !this.apiUrl.includes('your-nubefact'),
    );
  }

  /**
   * Formato de fecha estricto exigido por SUNAT / NubeFact: DD-MM-AAAA
   */
  private formatSunatDate(date: Date = new Date()): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Obtiene el siguiente número correlativo secuencial para una serie dada
   */
  async getNextCorrelative(series: string): Promise<number> {
    const record = await this.prisma.billingCorrelative.findUnique({
      where: { series },
    });
    return record ? record.currentNumber + 1 : 1;
  }

  /**
   * Registra el correlativo emitido exitosamente
   */
  async commitCorrelative(series: string, number: number): Promise<void> {
    await this.prisma.billingCorrelative.upsert({
      where: { series },
      update: { currentNumber: number },
      create: { series, currentNumber: number },
    });
  }

  /**
   * Emite comprobante de pago electrónico (Boleta o Factura)
   */
  async generateDocument(order: any) {
    if (!this.isConfigured()) {
      this.logger.warn(
        'NubeFact Token o URL no configurado (o usa placeholder). Omitiendo emisión electrónica.',
      );
      return null;
    }

    const isFactura = order.documentType === DocType.FACTURA;
    const series = isFactura
      ? appConfig.nubeFact.seriesFactura || 'F001'
      : appConfig.nubeFact.seriesBoleta || 'B001';

    const nextNumber = await this.getNextCorrelative(series);
    const payload = this.mapOrderToNubeFact(order, series, nextNumber);

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

      // Guardar el correlativo confirmado
      const issuedNumber = data.numero ? Number(data.numero) : nextNumber;
      await this.commitCorrelative(data.serie || series, issuedNumber);

      return {
        externalId: String(data.invoice_id || issuedNumber),
        pdfUrl: data.enlace_del_pdf || data.enlace,
        xmlUrl: data.enlace_del_xml,
        documentNumber: `${data.serie || series}-${issuedNumber}`,
      };
    } catch (error) {
      this.logger.error(`Critical Billing Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Emite Nota de Crédito Electrónica vinculada a un comprobante previo
   */
  async generateCreditNote(order: any, reason: string) {
    if (!this.isConfigured()) {
      this.logger.warn(
        'NubeFact Token no configurado. Omitiendo emisión de Nota de Crédito.',
      );
      return null;
    }

    const isFactura = order.documentType === DocType.FACTURA;
    const parts = (order.documentNumber || '').split('-');
    const originalSeries =
      parts[0] ||
      (isFactura
        ? appConfig.nubeFact.seriesFactura || 'F001'
        : appConfig.nubeFact.seriesBoleta || 'B001');
    const originalNumber = parseInt(parts[1], 10) || 1;

    const ncSeries = isFactura
      ? appConfig.nubeFact.seriesNcFactura || 'FC01'
      : appConfig.nubeFact.seriesNcBoleta || 'BC01';

    const nextNcNumber = await this.getNextCorrelative(ncSeries);

    const items = (order.items || []).map((item: any) => {
      const unitPrice = Number(item.unitPrice);
      const quantity = Number(item.quantity);
      const igvRate = 0.18;
      const valorUnitario = Number((unitPrice / (1 + igvRate)).toFixed(2));
      const subtotal = Number((valorUnitario * quantity).toFixed(2));
      const total = Number((unitPrice * quantity).toFixed(2));
      const igvTotal = Number((total - subtotal).toFixed(2));

      return {
        unidad_de_medida: 'NIU',
        codigo: item.productId || 'SERV',
        descripcion:
          item.product?.name || item.serviceName || 'Producto Dermatológico',
        cantidad: quantity,
        valor_unitario: valorUnitario,
        precio_unitario: unitPrice,
        subtotal: subtotal,
        tipo_de_igv: 1,
        igv: igvTotal,
        total: total,
      };
    });

    const totalGravada = Number(
      items.reduce((acc: number, it: any) => acc + it.subtotal, 0).toFixed(2),
    );
    const totalIgv = Number(
      items.reduce((acc: number, it: any) => acc + it.igv, 0).toFixed(2),
    );
    const totalFinal = Number(
      items.reduce((acc: number, it: any) => acc + it.total, 0).toFixed(2),
    );

    // Identificación fiscal del cliente
    let clienteTipoDoc: number | string = 1;
    let clienteNumeroDoc = '00000000';
    let clienteDenominacion = 'Clientes Varios';

    if (isFactura) {
      clienteTipoDoc = 6;
      clienteNumeroDoc = order.customerDocNumber || '00000000000';
      clienteDenominacion =
        order.customerLegalName ||
        `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() ||
        'Empresa Cliente';
    } else {
      if (order.customerDocNumber) {
        clienteNumeroDoc = order.customerDocNumber;
        clienteTipoDoc =
          order.customerDocType ? Number(order.customerDocType) : (clienteNumeroDoc.length === 8 ? 1 : 6);
      } else if (order.user?.dni) {
        clienteNumeroDoc = order.user.dni;
        clienteTipoDoc = 1;
      } else {
        clienteTipoDoc = '-';
        clienteNumeroDoc = '00000000';
      }

      clienteDenominacion =
        order.customerLegalName ||
        `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() ||
        'Público General';
    }

    const payload = {
      operacion: 'generar_comprobante',
      tipo_de_comprobante: 3,
      serie: ncSeries,
      numero: nextNcNumber,
      sunat_transaction: 1,
      cliente_tipo_de_documento: clienteTipoDoc,
      cliente_numero_de_documento: clienteNumeroDoc,
      cliente_denominacion: clienteDenominacion,
      cliente_direccion: order.customerAddress || 'Lima, Perú',
      cliente_email: order.user?.email || '',
      fecha_de_emision: this.formatSunatDate(),
      moneda: 1,
      porcentaje_de_igv: 18.0,
      total_gravada: totalGravada,
      total_inafecta: 0,
      total_exonerada: 0,
      total_gratuita: 0,
      total_otros_cargos: 0,
      total_igv: totalIgv,
      total: totalFinal,
      tipo_de_nota_de_credito: 1, // 1 = Anulación de la operación
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

      const issuedNcNumber = data.numero ? Number(data.numero) : nextNcNumber;
      await this.commitCorrelative(data.serie || ncSeries, issuedNcNumber);

      return {
        externalId: String(data.invoice_id || issuedNcNumber),
        pdfUrl: data.enlace_del_pdf || data.enlace,
        xmlUrl: data.enlace_del_xml,
        documentNumber: `${data.serie || ncSeries}-${issuedNcNumber}`,
      };
    } catch (error) {
      this.logger.error(`Critical Credit Note Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mapea una orden a la estructura JSON esperada por la API de NubeFact
   */
  private mapOrderToNubeFact(order: any, series: string, number: number) {
    const isFactura = order.documentType === DocType.FACTURA;

    // Identificación fiscal del cliente
    let clienteTipoDoc: number | string = 1;
    let clienteNumeroDoc = '00000000';
    let clienteDenominacion = 'Clientes Varios';
    const clienteDireccion = order.customerAddress || 'Lima, Perú';
    const clienteEmail = order.user?.email || '';

    if (isFactura) {
      clienteTipoDoc = 6; // RUC
      clienteNumeroDoc = order.customerDocNumber || '00000000000';
      clienteDenominacion =
        order.customerLegalName ||
        `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() ||
        'Empresa Cliente';
    } else {
      // BOLETA
      if (order.customerDocNumber) {
        clienteNumeroDoc = order.customerDocNumber;
        clienteTipoDoc =
          order.customerDocType ? Number(order.customerDocType) : (clienteNumeroDoc.length === 8 ? 1 : 6);
      } else if (order.user?.dni) {
        clienteNumeroDoc = order.user.dni;
        clienteTipoDoc = 1;
      } else {
        clienteTipoDoc = '-';
        clienteNumeroDoc = '00000000';
      }

      clienteDenominacion =
        order.customerLegalName ||
        `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() ||
        'Público General';
    }

    // Mapeo riguroso de ítems con redondeo a 2 decimales
    const items = (order.items || []).map((item: any) => {
      const unitPrice = Number(item.unitPrice);
      const quantity = Number(item.quantity);
      const igvRate = 0.18;
      const valorUnitario = Number((unitPrice / (1 + igvRate)).toFixed(2));
      const subtotal = Number((valorUnitario * quantity).toFixed(2));
      const total = Number((unitPrice * quantity).toFixed(2));
      const igv = Number((total - subtotal).toFixed(2));

      return {
        unidad_de_medida: 'NIU',
        codigo: item.productId || 'SERV',
        descripcion:
          item.product?.name || item.serviceName || 'Producto Dermatológico',
        cantidad: quantity,
        valor_unitario: valorUnitario,
        precio_unitario: unitPrice,
        subtotal: subtotal,
        tipo_de_igv: 1, // 1 = Gravado - Operación Onerosa
        igv: igv,
        total: total,
        anticipo_regularizacion: false,
        anticipo_documento_serie: '',
        anticipo_documento_numero: '',
      };
    });

    const totalGravada = Number(
      items.reduce((acc: number, it: any) => acc + it.subtotal, 0).toFixed(2),
    );
    const totalIgv = Number(
      items.reduce((acc: number, it: any) => acc + it.igv, 0).toFixed(2),
    );
    const totalFinal = Number(
      items.reduce((acc: number, it: any) => acc + it.total, 0).toFixed(2),
    );

    return {
      operacion: 'generar_comprobante',
      tipo_de_comprobante: isFactura ? 1 : 2,
      serie: series,
      numero: number,
      sunat_transaction: 1, // Venta interna
      cliente_tipo_de_documento: clienteTipoDoc,
      cliente_numero_de_documento: clienteNumeroDoc,
      cliente_denominacion: clienteDenominacion,
      cliente_direccion: clienteDireccion,
      cliente_email: clienteEmail,
      fecha_de_emision: this.formatSunatDate(),
      moneda: 1, // 1 = Soles
      tipo_de_cambio: '',
      porcentaje_de_igv: 18.0,
      total_gravada: totalGravada,
      total_inafecta: 0,
      total_exonerada: 0,
      total_gratuita: 0,
      total_otros_cargos: 0,
      total_detraccion: 0,
      total_igv: totalIgv,
      total: totalFinal,
      items: items,
      enviar_automaticamente_a_la_sunat: true,
      enviar_automaticamente_al_cliente: Boolean(clienteEmail),
    };
  }
}
