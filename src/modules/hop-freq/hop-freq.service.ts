import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Not, Repository } from 'typeorm'
import { IdsDto } from '~/common/dto/ids.dto'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { FHoppingEntity } from '~/entities/f-hopping'
import { FTableEntity } from '~/entities/f-table'
import { paginate } from '~/helper/paginate'
import { b_diff } from '~/utils'
import { default_hopping_conf } from '~/utils/init.mock.data'
import { BaseFreqTableDto } from './dto/base-freq-table.dto'
import { BaseTableDto } from './dto/base_table'
import { CoverFreqHopDto } from './freq_dto/cover-freq-hop.dto'
import { CreateFreqHopDto } from './freq_dto/create-freq-hop.dto'
import { GFreqHopDto } from './freq_dto/g-freq-hop.dto'
import { ResetFreqHopDto } from './freq_dto/reset-freq-hop.dto'
import { UpdateFreqHopBaseDto, UpdateFreqHopDto } from './freq_dto/update-freq-hop.dto'

@Injectable()
export class HopFreqService {
  constructor(
    @InjectRepository(FTableEntity) private readonly f_table_entity: Repository<FTableEntity>,
    @InjectRepository(FHoppingEntity) private readonly f_hopping_entity: Repository<FHoppingEntity>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly entity_manager: EntityManager,
  ) { }

  async create(alias: string, createBy: number, data: BaseFreqTableDto) {
    const temp = new FTableEntity()
    temp.alias = alias
    temp.createBy = createBy
    temp.law_end = data.law_end
    temp.law_spaceing = data.law_spacing
    temp.law_start = data.law_start
    temp.type = data.type
    return await this.f_table_entity.save(temp)
  }

  async create_table(data: BaseTableDto, uId: number) {
    const exist_data = await this.f_table_entity.find()
    console.log('exist_data', exist_data.length)
    if (exist_data.length >= 80) {
      throw new BusinessException('500:The number of data must not exceed 80')
    }
    const _temp = default_hopping_conf.find(item => item.type == data.type)
    const isExist = await this.f_table_entity.findOne({
      where: {
        alias: data.alias,
      },
    })
    if (isExist) {
      throw new BusinessException('500:alias is exist')
    }
    if (!_temp) {
      throw new BusinessException('500:table type does not exist')
    }

    data.point_count = data.point_count ? data.point_count : _temp.point_count
    data.law_end = data.law_end ? data.law_end : _temp.law_end
    data.law_start = data.law_start ? data.law_start : _temp.law_start
    if (!data.law_spacing) {
      const _law_spacing = b_diff(data.law_start, data.law_end, data.point_count, _temp.law_spacing)
      data.law_spacing = _law_spacing < _temp.law_spacing ? _temp.law_spacing : _law_spacing
    }
    return await this.entity_manager.transaction(async (manager) => {
      try {
        const db = new FTableEntity()
        db.alias = data.alias
        db.createBy = uId
        db.law_end = data.law_end
        db.law_spaceing = data.law_spacing
        db.law_start = data.law_start
        db.type = data.type
        const table = await manager.save(db)
        const points = Array.from({
          length: data.point_count,
        }).map((item, index) => {
          const value = data.law_start + index * data.law_spacing
          value > data.law_end ? data.law_end : value
          const hop_entity = new FHoppingEntity()
          hop_entity.createBy = uId
          hop_entity.f_table = table
          hop_entity.value = value
          return hop_entity
        })
        return await manager.save(points)
      }
      catch (error) {
        throw new BusinessException(`500:${error}`)
      }
    })
  }

  async findAll() {
    const res = await paginate(this.f_table_entity, { page: undefined, pageSize: undefined }, {
      order: {
        alias: 'ASC',
      },
    })
    return res
  }

  async findByTableType(type: string) {
    const results = await paginate(this.f_table_entity, { page: undefined, pageSize: undefined }, {
      where: {
        type,
      },
      relations: {
        hoppings: true,
      },
    })
    return results
  }

  async batch_remove_table(data: IdsDto) {
    for (const id of data.ids) {
      await this.remove(id)
    }
    return 'success'
  }

  async update(id: number, alias: string) {
    const isExist = await this.f_table_entity.findOne({
      where: {
        alias,
        id: Not(id),
      },
    })
    if (isExist) {
      throw new BusinessException('500:alias is exist')
    }
    return await this.f_table_entity.createQueryBuilder().update(FTableEntity).set({
      alias,
    }).where({
      id,
    }).execute()
  }

  async remove(id: number) {
    return await this.entity_manager.transaction(async (manager) => {
      if (id == 0) {
        await manager.query('SET FOREIGN_KEY_CHECKS = 0;')
        await manager.clear(FHoppingEntity)
        await manager.clear(FTableEntity)
        await manager.query('SET FOREIGN_KEY_CHECKS = 1;')
        return
      }
      return await manager.delete(FTableEntity, id)
    })
  }

  async create_freq(uId: number, freqhop_dto: CreateFreqHopDto) {
    const db = new FHoppingEntity()
    db.createBy = uId
    db.f_table = new FTableEntity()
    db.f_table.id = freqhop_dto.f_table_id
    db.value = freqhop_dto.value
    return await this.f_hopping_entity.save(db)
  }

  async batch_remove_freq(params: IdsDto) {
    return await this.f_hopping_entity.manager.transaction(async (manager) => {
      return await manager.delete(FHoppingEntity, params.ids)
    })
  }

  async cover_freq(uId: number, data: CoverFreqHopDto) {
    const { f_table_id } = data
    const _temp = default_hopping_conf.find(item => item.type == data.type)
    if (!_temp) {
      throw new BusinessException('500:table type does not exist')
    }
    const cur_table_entity = new FTableEntity()
    cur_table_entity.id = f_table_id
    // await this.f_hopping_entity.delete({
    //   f_table: cur_table_entity,
    // })
    await this.f_table_entity.createQueryBuilder().update(FTableEntity).set({
      type: data.type,
      law_start: data.law_start,
      law_spaceing: data.law_spacing,
      law_end: data.law_end,
      createBy: uId,
    }).where({
      id: f_table_id,
    }).execute()
    const _values = data.values.split(',')
    for (const item of _values) {
      const db = new FHoppingEntity()
      db.createBy = uId
      const _f_table = new FTableEntity()
      _f_table.id = f_table_id
      db.f_table = _f_table
      db.value = Number(item)
      await this.f_hopping_entity.save(db)
    }
    return 'success'
  }

  async findHopByTableId(f_table_id: number) {
    const temp = new FTableEntity()
    temp.id = f_table_id
    const res = await paginate(this.f_table_entity, { page: undefined, pageSize: undefined }, {
      where: {
        id: f_table_id,
      },
    })
    const _res = { ...res, items: res.items?.[0]?.hoppings ?? [] }
    _res.meta.currentPage = 1
    _res.meta.itemCount = _res.items.length
    _res.meta.itemsPerPage = _res.items.length
    _res.meta.totalItems = _res.items.length
    _res.meta.totalPages = 1
    return _res
  }

  async update_hop(freqhop_dto: UpdateFreqHopDto) {
    const promises = freqhop_dto.data.map((item) => {
      return this.f_hopping_entity.createQueryBuilder().update(FHoppingEntity).set({
        value: item.value,
      }).where({
        id: item.id,
      }).execute()
    })
    return await Promise.all(promises)
  }

  async resetHopByIds(data: ResetFreqHopDto) {
    const { ids } = data
    const _ids = ids.split(',').sort((a: string, b: string) => Number(a) - Number(b))

    const _temp = default_hopping_conf.find(item => item.type == data.type)
    if (!_temp) {
      throw new BusinessException('500:table type does not exist')
    }
    const point_count = _ids.length
    data.law_end = data.law_end ? data.law_end : _temp.law_end
    data.law_start = data.law_start ? data.law_start : _temp.law_start
    if (!data.law_spacing) {
      const _law_spacing = b_diff(data.law_start, data.law_end, point_count, _temp.law_spacing)
      data.law_spacing = _law_spacing < _temp.law_spacing ? _temp.law_spacing : _law_spacing
    }
    const points = _ids.map((item, index) => {
      const value = data.law_start + index * data.law_spacing
      const temp = new UpdateFreqHopBaseDto()
      temp.id = Number(item)
      temp.value = value > data.law_end ? data.law_end : value
      return temp
    })
    return await this.update_hop({ data: points })
  }

  g_random_freq(data: GFreqHopDto) {
    const _temp = default_hopping_conf.find(item => item.type == data.type)
    if (!_temp) {
      throw new BusinessException('500:table type does not exist')
    }
    data.point_count = data.point_count ? data.point_count : _temp.point_count
    data.law_end = data.law_end ? data.law_end : _temp.law_end
    data.law_start = data.law_start ? data.law_start : _temp.law_start
    if (!data.law_spacing) {
      const _law_spacing = b_diff(data.law_start, data.law_end, data.point_count, _temp.law_spacing)
      data.law_spacing = _law_spacing < _temp.law_spacing ? _temp.law_spacing : _law_spacing
    }
    return Array.from({ length: data.point_count }).map((item, index) => {
      const value = data.law_start + index * data.law_spacing
      return value > data.law_end ? data.law_end : value
    })
  }
}
