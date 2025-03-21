import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Like, Repository } from 'typeorm'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { PShotMessageEntity } from '~/entities/p_shot_message'
import { paginate } from '~/helper/paginate'
import { IdsDto } from '../../common/dto/ids.dto'
import { CreatePShotMessageDto } from './dto/create-p_shot_message.dto'
import { SearchPShotMessageDto } from './dto/search-p_shot_message.dto'
import { UpdatePShotMessageDto } from './dto/update-p_shot_message.dto'

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
      throw new BusinessException(ErrorEnum.DuplicateSMSContent)
    }
    if (count >= 100) {
      throw new BusinessException(ErrorEnum.SystemDataLimitReached)
    }
    const temp = new PShotMessageEntity()
    temp.text_message = dto.text_message
    temp.createBy = uId
    return await this.p_shot_message_entity.save(temp)
  }

  async findAll(dto: SearchPShotMessageDto, isLike = true) {
    return paginate(this.p_shot_message_entity, { page: dto.page, pageSize: dto.pageSize }, {
      where: {
        ...(dto.text_message && { text_message: isLike ? Like(dto.text_message) : dto.text_message })
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
