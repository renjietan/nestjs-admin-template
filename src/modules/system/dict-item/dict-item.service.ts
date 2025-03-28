import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { In, Like, Repository } from 'typeorm'

import { Order } from '~/common/dto/pager.dto'
import { BusinessException } from '~/common/exceptions/biz.exception'

import { ErrorEnum } from '~/constants/error-code.constant'
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
      ...(value && { value }),
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
   * @path: src\modules\system\dict-item\dict-item.service.ts
   * @functionName  查询多个字典，若找不到直接返回异常
   * @param {object}
   * @description { "键名随意": 键值是字典表的code }
   * @author 谭人杰
   * @date 2025-03-14 11:47:43
   */
  async validateDict<T extends Record<string, any>>(data: T): Promise<DictItemResult<T>> {
    const values = Object.values(data)
    const keys = Object.keys(data)
    const _res = await this.dictItemRepository.find({
      where: {
        value: In(Array.from(new Set(values))),
        status: 1,
      },
    })
    if (_res.length == 0)
      throw new BusinessException(ErrorEnum.InvalidDictionaryFieldValue)
    
    const res = _res.reduce((cur, pre) => {
      cur[pre.value] = pre
      return cur
    }, {})
    console.log("res===================", res);
    const entity_obj = keys.map(item => {
      let value = data[item]
      return {
        [item]: res[value]
      }
    }) as DictItemResult<T>
    console.log(entity_obj);
    return entity_obj
  }
}
