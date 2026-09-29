import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { IzipayService } from './izipay.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { Role } from '@prisma/client';

class CreatePaymentTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'El ID de la orden (orderId) es obligatorio.' })
  orderId: string;
}

class ConfirmPaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'El ID de la orden (orderId) es obligatorio.' })
  orderId: string;

  @IsNotEmpty({ message: 'El payload krAnswer es obligatorio.' })
  krAnswer: any;

  @IsString()
  @IsNotEmpty({ message: 'El hash criptográfico krHash es obligatorio.' })
  krHash: string;
}

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly izipayService: IzipayService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  @Post('izipay/token')
  @Public() // Permitido para huéspedes (órdenes rápidas sin usuario) y usuarios registrados
  async createToken(
    @Body() body: CreatePaymentTokenDto,
    @Request() req: any,
  ) {
    const { orderId } = body;

    // 1. Obtener la orden real y pendiente de la base de datos
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException(`La orden ${orderId} no existe en el sistema.`);
    }

    if (order.isPaid) {
      throw new BadRequestException('Esta orden ya se encuentra pagada previamente.');
    }

    if (order.isCancelled) {
      throw new BadRequestException('Esta orden ha sido cancelada.');
    }

    if (order.source !== 'WEB' || order.paymentMethod !== 'CREDIT_CARD') {
      throw new BadRequestException(
        'Solo las órdenes WEB con método CREDIT_CARD pueden inicializar el pago con tarjeta.',
      );
    }

    // 2. Control de acceso para órdenes asignadas a un usuario
    if (order.userId) {
      if (!req.user) {
        throw new ForbiddenException(
          'Esta orden pertenece a un usuario registrado. Debes iniciar sesión para procesar su pago.',
        );
      }
      const isOwner = req.user.userId === order.userId;
      const isStaff =
        req.user.role === Role.ADMIN || req.user.role === Role.RECEPTION;
      if (!isOwner && !isStaff) {
        throw new ForbiddenException(
          'No tienes autorización para pagar una orden de otro usuario.',
        );
      }
    }

    // 3. Monto inmutable calculado desde la base de datos (inmune a manipulación del cliente)
    const amount = order.total;
    if (amount <= 0) {
      throw new BadRequestException('El monto total de la orden debe ser superior a cero.');
    }

    const email = order.user?.email || 'paciente@dermq.com';

    const formToken = await this.izipayService.generateFormToken(
      amount,
      'PEN',
      order.id,
      email,
    );

    return {
      success: true,
      formToken,
      orderId: order.id,
      amount,
      currency: 'PEN',
    };
  }

  @Post('izipay/confirm')
  @Public()
  async confirmPayment(
    @Body() body: ConfirmPaymentDto,
    @Request() req: any,
  ) {
    const { orderId, krAnswer, krHash } = body;
    return this.ordersService.confirmPayment(
      orderId,
      krAnswer,
      krHash,
      req.user,
    );
  }
}
