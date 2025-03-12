import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PmMasterService } from './pm-master.service';
import { PmMasterController } from './pm-master.controller';
import { PMMasterEntity } from '~/entities/pm_master';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PMMasterEntity
    ])
  ],
  controllers: [PmMasterController],
  providers: [PmMasterService],
})
export class PmMasterModule {}
