import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { IzipayService } from './izipay.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';

class CreatePaymentTokenDto {
  amount: number;
  currency?: string;
  orderId?: string;
  email?: string;
}

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly izipayService: IzipayService) {}

  @Post('izipay/token')
  @Public() // Permitido para huéspedes (citas rápidas) y usuarios registrados
  async createToken(@Body() body: CreatePaymentTokenDto) {
    const { amount, currency, orderId, email } = body;
    const formToken = await this.izipayService.generateFormToken(
      amount,
      currency || 'PEN',
      orderId,
      email || 'paciente@dermq.com',
    );
    return { formToken };
  }
}
