import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterEntity } from '~/entities/t_master';
import { SubEntity } from '~/entities/t_sub';
import { SubDeviceEntity } from '~/entities/t_sub_device';
import { SubHopEntity } from '~/entities/t_sub_hop';
import { SubTimeSlotEntity } from '~/entities/t_sub_slot';
import { MissionPlanningController } from './mission_planning.controller';
import { MissionPlanningService } from './mission_planning.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MasterEntity,
      SubEntity,
      SubDeviceEntity,
      SubHopEntity,
      SubTimeSlotEntity,
    ])
  ],
  controllers: [MissionPlanningController],
  providers: [MissionPlanningService],
})
export class MissionPlanningModule {}
