import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Like, Repository } from 'typeorm'
import { SearchPShotMessageDto } from './dto/search-p_shot_message.dto'
import { UpdatePShotMessageDto } from './dto/update-p_shot_message.dto'
import { CreatePShotMessageDto } from './dto/create-p_shot_message.dto'
import { IdsDto } from '../../common/dto/ids.dto';
import { PShotMessageEntity } from '~/entities/p_shot_message'
import { paginate } from '~/helper/paginate'
import { BusinessException } from '~/common/exceptions/biz.exception'

@Injectable()
export class PShotMessageService {
  constructor(
    @InjectRepository(PShotMessageEntity) private readonly p_shot_message_entity: Repository<PShotMessageEntity>,
  ) { }

  async create(dto: CreatePShotMessageDto, uId: number) {
    const data = await this.p_shot_message_entity.createQueryBuilder('p_shot_message').where(
      new Brackets((qb) => {
        if (dto.text_message) {
          qb.andWhere('p_shot_message.text_message = :text_message', { text_message: dto.text_message })
        }
      }),
    ).getOne()
    const count = await this.p_shot_message_entity.createQueryBuilder('p_shot_message').getCount()
    if (data) {
      throw new BusinessException('500:shot message is exist')
    }
    if (count >= 100) {
      throw new BusinessException('500:shot message is max')
    }
    const temp = new PShotMessageEntity()
    temp.text_message = dto.text_message
    temp.createBy = uId
    return await this.p_shot_message_entity.save(temp)
  }

  async findAll(dto: SearchPShotMessageDto, isLike = true) {
    return paginate(this.p_shot_message_entity, { page: dto.page, pageSize: dto.pageSize }, {
      where: {
        text_message: Like(dto.text_message)
      },
    })
  }

  async update(id: number, dto: UpdatePShotMessageDto, uId: number) {
    return await this.p_shot_message_entity.createQueryBuilder().update(PShotMessageEntity).set({
      text_message: dto.text_message,
      updateBy: uId
    }).where('id = :id', { id }).execute()
  }

  async remove(dto: IdsDto) {
    return await this.p_shot_message_entity.manager.transaction((manager) => {
      return manager.delete(PShotMessageEntity, dto.ids)
    })
  }
}
