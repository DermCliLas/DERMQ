import { Module } from '@nestjs/common';
import { IzipayService } from './izipay.service';
import { PaymentsController } from './payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [IzipayService],
  exports: [IzipayService],
})
export class PaymentsModule {}
