import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlotEntity } from '~/entities/time-slot';
import { paginate } from '~/helper/paginate';
import { TimeSlotDto } from './dto/time-slot.dto';

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

  async findAll() {
    return paginate(this.time_slot_entity,{ page: undefined, pageSize: undefined })
  }

  async remove(id: number) {
    await this.time_slot_entity.delete(id)  
  }
}
