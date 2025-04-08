import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterEntity } from '~/entities/t_master';
import { SubEntity } from '~/entities/t_sub';
import { SubDeviceEntity } from '~/entities/t_sub_device';
import { MissionPlanningController } from './mission_planning.controller';
import { MissionPlanningService } from './mission_planning.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MasterEntity,
      SubEntity,
      SubDeviceEntity
    ])
  ],
  controllers: [MissionPlanningController],
  providers: [MissionPlanningService],
})
export class MissionPlanningModule {}
