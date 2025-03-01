import { Module } from '@nestjs/common';
import { HopFreqService } from './hop-freq.service';
import { HopFreqController } from './hop-freq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FHoppingEntity } from '~/entities/f-hopping';
import { FTableEntity } from '~/entities/f-table';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FHoppingEntity,
      FTableEntity
    ])
  ],
  controllers: [HopFreqController],
  providers: [HopFreqService],
})
export class HopFreqModule {}
