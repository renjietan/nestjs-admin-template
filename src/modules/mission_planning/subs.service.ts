import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterEntity } from '~/entities/t_master';
import { MasterDto } from './dto/mission_planning.dto';

@Injectable()
export class MissionPlanningService {
  constructor(
    @InjectRepository(MasterEntity) private readonly master_entity: Repository<MasterEntity>
  ) {}
  async create(dto: MasterDto) {
    return this.master_entity.save(dto)
  }

  async update(id: number, dto: MasterDto) {
    await this.master_entity.createQueryBuilder().update(MasterEntity).set({
      ...(!!dto.name && { name: dto.name }),
      ...(!!dto.startTime && { startTime: dto.startTime }),
      ...(!!dto.endTime && { endTime: dto.endTime }),
      ...(!!dto.region && { region: dto.region }),
      ...(!!dto.dscription && { dscription: dto.dscription }),
    }).where({
      id
    }).execute()
  }
}
