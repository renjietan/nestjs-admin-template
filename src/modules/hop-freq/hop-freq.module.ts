import { Module } from '@nestjs/common';
import { HopFreqService } from './hop-freq.service';
import { HopFreqController } from './hop-freq.controller';

@Module({
  controllers: [HopFreqController],
  providers: [HopFreqService],
})
export class HopFreqModule {}
