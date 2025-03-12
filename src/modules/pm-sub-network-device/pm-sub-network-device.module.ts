import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceModule } from '../device/device.module'
import { PmSubNetWorkDeviceController } from './pm-sub-network-device.controller'
import { PmSubNetWorkDeviceService } from './pm-sub-network-device.service'
import { PMSubNetWorkDeviceEntity } from '~/entities/pm_sub_network_device'
import { PMSubEntity } from '~/entities/pm_sub'
import { DeviceEntity } from '~/entities/d_device'

@Module({
  imports: [
    DeviceModule,
    TypeOrmModule.forFeature([
      PMSubNetWorkDeviceEntity,
      PMSubEntity,
      DeviceEntity,
    ]),
  ],
  controllers: [PmSubNetWorkDeviceController],
  providers: [PmSubNetWorkDeviceService],
  exports: [
    PmSubNetWorkDeviceService,
  ],
})
export class PmSubNetWorkDeviceModule {}
