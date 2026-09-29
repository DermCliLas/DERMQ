import { Module, forwardRef } from '@nestjs/common';
import { IzipayService } from './izipay.service';
import { PaymentsController } from './payments.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  controllers: [PaymentsController],
  providers: [IzipayService],
  exports: [IzipayService],
})
export class PaymentsModule {}
