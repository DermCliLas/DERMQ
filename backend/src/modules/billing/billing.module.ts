import { Module } from '@nestjs/common';
import { NubeFactService } from './nubefact.service';

@Module({
  providers: [NubeFactService],
  exports: [NubeFactService],
})
export class BillingModule {}
