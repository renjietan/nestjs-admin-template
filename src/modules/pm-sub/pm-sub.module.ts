import { Module } from '@nestjs/common';
import { PmSubService } from './pm-sub.service';
import { PmSubController } from './pm-sub.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PmSubNetWorkDeviceModule } from '../pm-sub-network-device/pm-sub-network-device.module';
import { PMSubEntity } from '~/entities/pm_sub';
import { PMSubNetWorkDeviceEntity } from '~/entities/pm_sub_network_device';

@Module({
  imports: [
    PmSubNetWorkDeviceModule,
    TypeOrmModule.forFeature([
      PMSubEntity,
      PMSubNetWorkDeviceEntity
    ])
  ],
  controllers: [PmSubController],
  providers: [PmSubService],
})
export class PmSubModule {}
