import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Like, Repository } from 'typeorm'

import { Order } from '~/common/dto/pager.dto'
import { BusinessException } from '~/common/exceptions/biz.exception'
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
    field,
    order,
  }: DictItemQueryDto): Promise<Pagination<DictItemEntity>> {
    const queryBuilder = this.dictItemRepository.createQueryBuilder('dict_item').orderBy({ [field || 'orderNo']: order || Order.ASC }).where({
      ...(label && { label: Like(`%${label}%`) }),
      ...(value && { value: Like(`%${value}%`) }),
      ...(typeId && { type: { id: typeId } }),
    }).leftJoinAndSelect('dict_item.type', 'type')

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

  /**
   * @path: src\modules\system\dict-item\dict-item.service.ts
   * @functionName  查询多个字典，若找不到直接返回异常
   * @param {object}
   * @description { "键名随意": 键值是字典表的code }
   * @author 谭人杰
   * @date 2025-03-14 11:47:43
   */
  async validateDict<T extends Record<string, any>>(data: T): Promise<DictItemResult<T>> {
    const res = {} as DictItemResult<T>
    for (const key in data) {
      const dict_model = await this.findOneByCode(data[key])
      if (!dict_model) {
        throw new BusinessException(`500:该字段的值不在当前字典范围内，请选择有效的字典项或更新字典`)
      }
      else {
        res[key] = dict_model
      }
    }
    return res
  }
}
