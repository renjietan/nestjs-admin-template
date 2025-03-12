import { Module } from '@nestjs/common';
import { ETableService } from './e_table.service';
import { ETableController } from './e_table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ETableDetailService } from '../e_table_detail/e_table_detail.service';
import { ETableEntity } from '~/entities/e_table';
import { ETableDetailEntity } from '~/entities/e_table_detail';
import { DictItemModule } from '../system/dict-item/dict-item.module';

@Module({
  imports: [
    DictItemModule,
    TypeOrmModule.forFeature([
      ETableEntity,
      ETableDetailEntity
    ])
  ],
  controllers: [ETableController],
  providers: [ETableService, ETableDetailService],
})
export class ETableModule {}
