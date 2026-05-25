import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderSource } from '@prisma/client';
import { NubeFactService } from '../billing/nubefact.service';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private nubeFactService: NubeFactService,
    private emailService: EmailService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { items, paymentMethod, documentType, source } = createOrderDto;

    // 1. Validate all products exist and have enough stock
    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException(
        'Uno o más productos no fueron encontrados o están inactivos.',
      );
    }

    // Check stock for each item
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}.`,
        );
      }
    }

    // 2. Calculate totals
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const unitPrice = Number(product.price);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subTotal: unitPrice * item.quantity,
      };
    });

    const total = orderItems.reduce((sum, i) => sum + i.subTotal, 0);

    // 3. Run everything inside a Prisma transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          paymentMethod,
          isPaid: true, // Mark as paid since we simulate a successful payment
          documentType: documentType ?? 'BOLETA',
          source: source ?? OrderSource.WEB,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, sku: true, price: true },
              },
            },
          },
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });

      // Decrement stock for each product
      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      // 3.5. Emitir Comprobante Electrónico (NubeFact)
      try {
        const billingResult =
          await this.nubeFactService.generateDocument(createdOrder);

        if (billingResult) {
          // Actualizar orden con datos de NubeFact
          return await tx.order.update({
            where: { id: createdOrder.id },
            data: {
              documentNumber: billingResult.documentNumber,
              nubeFactId: billingResult.externalId,
              nubeFactPdfUrl: billingResult.pdfUrl,
              nubeFactXmlUrl: billingResult.xmlUrl,
            },
            include: {
              items: {
                include: {
                  product: {
                    select: { id: true, name: true, sku: true, price: true },
                  },
                },
              },
              user: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          });
        }
      } catch (err) {
        // El error hará que la transacción de Prisma haga ROLLBACK
        throw new BadRequestException(
          `Fallo en Facturación Electrónica: ${err.message}. La venta no ha sido procesada.`,
        );
      }

      return createdOrder;
    });

    // ─── EMAIL INVOICE NOTIFICATION ──────────────────────────────────────────
    if (order && order.nubeFactPdfUrl) {
      this.emailService
        .sendOrderInvoice(order, {
          documentNumber: order.documentNumber,
          pdfUrl: order.nubeFactPdfUrl,
          xmlUrl: order.nubeFactXmlUrl,
        })
        .catch((err) =>
          console.error('Error sending order invoice email:', err),
        );
    }

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { product: { select: { id: true, name: true, sku: true } } },
        },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, imageUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
    if (!order) throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    return order;
  }
}
