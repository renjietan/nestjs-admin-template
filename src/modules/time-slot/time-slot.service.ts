import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IdsDto } from '~/common/dto/ids.dto';
import { TimeSlotEntity } from '~/entities/time-slot';
import { paginate } from '~/helper/paginate';
import { PointsDto, TimeSlotDto } from './dto/time-slot.dto';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlotEntity) private readonly time_slot_entity: Repository<TimeSlotEntity>
  ) {}
  async create(dto: TimeSlotDto, uId: number) {
     return this.time_slot_entity.save({
      ...dto,
      createBy: uId,
      updateBy: uId
     })
  }

  async update(id: number, dto: PointsDto, uId: number) {
    await this.time_slot_entity.createQueryBuilder().update(TimeSlotEntity).set({
      points: dto.points
    }).where({
      id
    }).execute()
 }


  async findAll() {
    return paginate(this.time_slot_entity,{ page: undefined, pageSize: undefined })
  }

  async remove(dto: IdsDto) {
    await this.time_slot_entity.delete({
      id: In(dto.ids)
    })
  }
}
