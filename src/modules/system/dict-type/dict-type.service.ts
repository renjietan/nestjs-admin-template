import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EntitySchema, Like, Repository } from 'typeorm'

import { DictTypeEntity } from '~/entities/dict-type.entity'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { DictTypeDto, DictTypeQueryDto } from './dict-type.dto'
import { DictItemService } from '../dict-item/dict-item.service'
import { DictItemEntity } from '~/entities/dict-item.entity'
import { createPaginationObject } from '~/helper/paginate/create-pagination'

@Injectable()
export class DictTypeService {
  constructor(
    @InjectRepository(DictTypeEntity)
    private dictTypeRepository: Repository<DictTypeEntity>,
    private readonly dict_service: DictItemService
    // @InjectRepository(DictItemEntity)
    // private dictItemRepository: Repository<DictItemEntity>,
  ) { }

  async full() {
    let entities = await this.dict_service.page({})
    let items = entities.items.reduce((cur, pre) => {
      let type_id = pre?.type?.id
      !cur[type_id] && (cur[type_id] = {...pre.type, children: []})
      delete pre.type
      cur[type_id].children.push(pre)
      return cur
    }, {})
    let _items = Object.values(items)
    return createPaginationObject({
      items: _items,
      totalItems: _items.length,
      currentPage: 1,
      limit: _items.length
    })
  }

  /**
   * 罗列所有配置
   */
  async page({
    page,
    pageSize,
    name,
    code,
  }: DictTypeQueryDto): Promise<Pagination<DictTypeEntity>> {
    const queryBuilder = this.dictTypeRepository.createQueryBuilder('dict_type').where({
      ...(name && { name }),
      ...(code && { code }),
    })

    return paginate(queryBuilder, { page, pageSize })
  }

  /** 一次性获取所有的字典类型 */
  async getAll() {
    return this.dictTypeRepository.find()
  }

  /**
   * 获取参数总数
   */
  async countConfigList(): Promise<number> {
    return this.dictTypeRepository.count()
  }

  /**
   * 新增
   */
  async create(dto: DictTypeDto): Promise<void> {
    await this.dictTypeRepository.insert(dto)
  }

  /**
   * 更新
   */
  async update(id: number, dto: Partial<DictTypeDto>): Promise<void> {
    await this.dictTypeRepository.update(id, dto)
  }

  /**
   * 删除
   */
  async delete(id: number): Promise<void> {
    await this.dictTypeRepository.delete(id)
  }

  /**
   * 查询单个
   */
  async findOne(id: number): Promise<DictTypeEntity> {
    return this.dictTypeRepository.findOneBy({ id })
  }
}
