import { Module } from '@nestjs/common';
import { HopFreqService } from './hop-freq.service';
import { HopFreqController } from './hop-freq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FHoppingEntity } from '~/entities/f-hopping';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FHoppingEntity
    ])
  ],
  controllers: [HopFreqController],
  providers: [HopFreqService],
})
export class HopFreqModule {}
