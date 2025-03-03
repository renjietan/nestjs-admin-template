import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { DeviceEntity } from '~/entities/d_device'
import { DictItemModule } from '../system/dict-item/dict-item.module'
import { DictItemService } from '../system/dict-item/dict-item.service'
import { DictItemEntity } from '~/entities/dict-item.entity'

@Module({
  imports: [
    DictItemModule,
    TypeOrmModule.forFeature([
      DeviceEntity,
    ]),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
