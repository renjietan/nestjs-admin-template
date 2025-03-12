import { Module } from '@nestjs/common';
import { WaveDeviceConfigService } from './wave_device_config.service';
import { WaveDeviceConfigController } from './wave_device_config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictItemModule } from '../system/dict-item/dict-item.module';
import { WaveDeviceConfigEntity } from '~/entities/wave_device_config';

@Module({
  imports: [
    DictItemModule,
    TypeOrmModule.forFeature([
      WaveDeviceConfigEntity
    ]),
  ],
  controllers: [WaveDeviceConfigController],
  providers: [WaveDeviceConfigService],
})
export class WaveDeviceConfigModule {}
