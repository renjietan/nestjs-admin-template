import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FHoppingEntity } from '~/entities/f-hopping';
import { FTableEntity } from '~/entities/f-table';
import { DictItemModule } from '../system/dict-item/dict-item.module';
import { HopFreqController } from './hop-freq.controller';
import { HopFreqService } from './hop-freq.service';

@Module({
  imports: [
    DictItemModule,
    TypeOrmModule.forFeature([
      FHoppingEntity,
      FTableEntity
    ])
  ],
  controllers: [HopFreqController],
  providers: [HopFreqService],
})
export class HopFreqModule {}
