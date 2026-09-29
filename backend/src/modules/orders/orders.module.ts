import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { BillingModule } from '../billing/billing.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [BillingModule, forwardRef(() => PaymentsModule)],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
