import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DictItemEntity } from './../../../entities/dict-item.entity';

import { Repository } from 'typeorm';

import { Exact } from '~/common/dto/pager.dto';
import { DictTypeEntity } from '~/entities/dict-type.entity';

import { BusinessException } from '~/common/exceptions/biz.exception';
import { paginate } from '~/helper/paginate';
import { createPaginationObject } from '~/helper/paginate/create-pagination';
import { Pagination } from '~/helper/paginate/pagination';
import { DictItemService } from '../dict-item/dict-item.service';
import { PatchDto } from './dict-patch.dto';
import { DictTypeDto, DictTypeQueryDto } from './dict-type.dto';

@Injectable()
export class DictTypeService {
  constructor(
    @InjectRepository(DictTypeEntity)
    private dictTypeRepository: Repository<DictTypeEntity>,
    private readonly dict_service: DictItemService,
  ) { }

  async patch(dto: PatchDto) {
    const { allow_clean, dicts } = dto
    return await this.dictTypeRepository.manager.transaction(async (manager) => {
      try {
        console.log("==================  init =================");
        if (allow_clean == Exact.TRUE) {
          console.log("==================  DELETE =================");
          await manager.clear(DictTypeEntity)
          await manager.clear(DictItemEntity)
          console.log("==================  DELETE FINISH =================");
        }
        const dict_type_entites = await manager.find(DictTypeEntity)
        const dict_item_entites = await manager.find(DictItemEntity)

        const count_type = allow_clean ? 0 : ((await manager.findOne(DictTypeEntity, { order: { createdAt: 'DESC' } }))?.id ?? 0)
        const count_item = allow_clean ? 0 : ((await manager.findOne(DictTypeEntity, { order: { createdAt: 'DESC' } }))?.id ?? 0)
        let type_init_id = count_type + 1
        let item_init_id = count_item + 1
        const res = []
        for (const e of dicts) {
          if (dict_type_entites.some(c => c.name == e.name || c.code == e.code || c.en_name == e.en_name)) throw new BusinessException("500: 不可新增重复的字典")
          const insert_type_obj = {
            id: type_init_id,
            name: e.name,
            code: e.code,
            en_name: e.en_name,
            status: e?.status || 1,
            remark: e?.remark || '',
            createBy: e?.createBy || 1,
            items: []
          }
          await manager.insert(DictTypeEntity, insert_type_obj)
          const items = e?.items ?? []
          let index = 1
          for (const item of items) {
            if (dict_item_entites.some(c => c.label == item.label || c.value == item.value || c.en_label == item.en_label)) throw new BusinessException("500: 不可新增重复的字典")
            const insert_item_obj = {
              id: item_init_id,
              label: item.label,
              value: item.value,
              en_label: item.en_label,
              status: e?.status || 1,
              remark: e?.remark || '',
              createBy: e?.createBy || 1,
              type: {
                id: type_init_id,
              },
              orderNo: index,
            }
            await manager.insert(DictItemEntity, insert_item_obj)
            item_init_id++
            index++
            insert_type_obj.items.push(insert_type_obj)
          }
          type_init_id++
          res.push(insert_type_obj)
        }
        return res
      } catch (error) {
        console.log(`批量新增失败: system/dict-type (${ error })`);
        throw new BusinessException(`500: 批量新增失败`)
      }
    })
  }

  async full() {
    const entities = await this.dict_service.page({})
    const items = entities.items.reduce((cur, pre) => {
      const type_id = pre?.type?.id
      !cur[type_id] && (cur[type_id] = { ...pre.type, children: [] })
      delete pre.type
      cur[type_id].children.push(pre)
      return cur
    }, {})
    const _items = Object.values(items)
    return createPaginationObject({
      items: _items,
      totalItems: _items.length,
      currentPage: 1,
      limit: _items.length,
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
