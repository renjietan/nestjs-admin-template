import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PMSubEntity } from '~/entities/pm_sub';
import { PMSubNetWorkDeviceEntity } from '~/entities/pm_sub_network_device';
import { PmSubController } from './pm-sub.controller';
import { PmSubService } from './pm-sub.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PMSubEntity, PMSubNetWorkDeviceEntity])
  ],
  controllers: [PmSubController],
  providers: [PmSubService],
})
export class PmSubModule {}
