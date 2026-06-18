import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  findMyOrders(@Request() req: any) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Post(':id/cancel')
  @Roles(Role.ADMIN, Role.RECEPTION)
  cancel(@Param('id') id: string, @Body() cancelOrderDto: CancelOrderDto) {
    return this.ordersService.cancel(id, cancelOrderDto.reason);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
