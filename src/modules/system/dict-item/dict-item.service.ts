import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Like, Repository } from 'typeorm'

import { DictItemEntity } from '~/entities/dict-item.entity'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { DictItemDto, DictItemQueryDto } from './dict-item.dto'

@Injectable()
export class DictItemService {
  constructor(
    @InjectRepository(DictItemEntity)
    private dictItemRepository: Repository<DictItemEntity>,
  ) { }

  /**
   * 罗列所有配置
   */
  async page({
    page,
    pageSize,
    label,
    value,
    typeId,
  }: DictItemQueryDto): Promise<Pagination<DictItemEntity>> {
    const queryBuilder = this.dictItemRepository.createQueryBuilder('dict_item').orderBy({ orderNo: 'ASC' }).where({
      ...(label && { label: Like(`%${label}%`) }),
      ...(value && { value: Like(`%${value}%`) }),
      ...(typeId && { type: { id: typeId } }),
    })

    return paginate(queryBuilder, { page, pageSize })
  }

  /**
   * 获取参数总数
   */
  async countConfigList(): Promise<number> {
    return this.dictItemRepository.count()
  }

  /**
   * 新增
   */
  async create(dto: DictItemDto): Promise<void> {
    const { typeId, ...rest } = dto
    await this.dictItemRepository.insert({
      ...rest,
      type: {
        id: typeId,
      },
    })
  }

  /**
   * 更新
   */
  async update(id: number, dto: Partial<DictItemDto>): Promise<void> {
    const { typeId, ...rest } = dto
    await this.dictItemRepository.update(id, {
      ...rest,
      type: {
        id: typeId,
      },
    })
  }

  /**
   * 删除
   */
  async delete(id: number): Promise<void> {
    await this.dictItemRepository.delete(id)
  }

  /**
   * 查询单个
   */
  async findOne(id: number): Promise<DictItemEntity> {
    return this.dictItemRepository.findOneBy({ id })
  }

  /**
 * 根据 value 值 查询单个
 */
  async findOneByCode(code: string): Promise<DictItemEntity> {
    return this.dictItemRepository.findOneBy({ value: code })
  }
}
