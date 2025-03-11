import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ETableDetailService } from './e_table_detail.service';
import { ETableDetailController } from './e_table_detail.controller';
import { ETableDetailEntity } from '~/entities/e_table_detail';
import { DictItemModule } from '../system/dict-item/dict-item.module';

@Module({
  imports: [
    DictItemModule,
    TypeOrmModule.forFeature([
      ETableDetailEntity,
    ]),
  ],
  controllers: [ETableDetailController],
  providers: [ETableDetailService],
  exports: [ETableDetailService],
})
export class ETableDetailModule {}
