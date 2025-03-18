import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DictTypeEntity } from '../../../entities/dict-type.entity'
import { DictItemModule } from '../dict-item/dict-item.module'
import { DictTypeController } from './dict-type.controller'
import { DictTypeService } from './dict-type.service'

const services = [DictTypeService]

@Module({
  imports: [TypeOrmModule.forFeature([DictTypeEntity]), DictItemModule],
  controllers: [DictTypeController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class DictTypeModule {}
