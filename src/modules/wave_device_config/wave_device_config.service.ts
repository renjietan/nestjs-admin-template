import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Equal, EqualOperator, In, Repository } from 'typeorm'
import { BatchCreateWaveDeviceConfigDto } from './dto/batchCreate.dto'
import { CreateWaveDeviceConfigDto } from './dto/createOne.dto'
import { SearcheWaveDeviceConfigDto } from './dto/search.dto'
import { UpdateWaveDeviceConfigDto } from './dto/updateOne.dto'
import { BatchUpdateWaveDeviceConfigDto } from './dto/batchUpdate'
import { cursorTo } from 'readline'
import { paginate } from '~/helper/paginate'
import { WaveDeviceConfigEntity } from '~/entities/wave_device_config'
import { DictItemService } from '../system/dict-item/dict-item.service'
import { BusinessException } from '~/common/exceptions/biz.exception'


@Injectable()
export class WaveDeviceConfigService {
  constructor(
    @InjectRepository(WaveDeviceConfigEntity) private readonly waveDeviceConfigEntity: Repository<WaveDeviceConfigEntity>,
    private readonly dict_item_service: DictItemService
  ) { }

  async search(data: SearcheWaveDeviceConfigDto) {
    const pageNum = data?.page
    const pageSize = data?.pageSize
    let where_query = {
      skip: null,
      take: null,
      where: {
        deviceModel: null,
        waveType: null
      }
    }
    if (!!pageNum && !!pageSize) {
      where_query.skip = (pageNum - 1) * pageSize
      where_query.take = pageSize
    } else {
      delete where_query.skip
      delete where_query.take
    }
    if (!!data?.waveTypes) {
      where_query.where.waveType = In(data.waveTypes.split(','))
    } else {
      delete where_query.where.waveType
    }
    if (!!data?.deviceModel) {
      where_query.where.deviceModel = Equal(data.deviceModel)
    } else {
      delete where_query.where.deviceModel
    }
    return paginate(this.waveDeviceConfigEntity, {
      page: undefined,
      pageSize: undefined
    }, {
      ...where_query,
      order: {
        createdAt: "DESC",
      },
    })
  }

  async create(params: CreateWaveDeviceConfigDto, uId: number) {
    await this.dict_item_service.validateDict({
      deviceType: params.deviceType,
      deviceModel: params.deviceModel,
      waveType: params.waveType,
      valueType: params.valueType
    })
    const entity = new WaveDeviceConfigEntity()
    entity.createBy = uId
    entity.deviceModel = params.deviceModel
    entity.deviceType = params.deviceType
    entity.step_value = params.step_value
    entity.name = params.name
    entity.waveType = params.waveType
    entity.group = params.group
    entity.unit = params.unit
    entity.min_value = params.min_value
    entity.max_value = params.max_value
    entity.valueType = params.valueType
    entity.init_value = params.initValue
    return await this.waveDeviceConfigEntity.save(entity)
  }

  async batchCreate(params: BatchCreateWaveDeviceConfigDto, uId: number) {
    const { list } = params
    const validate_error = await this.validate_wave_list(list)
    if (validate_error.length > 0) {
      throw new BusinessException(`500:${ validate_error?.[0] ?? 'Unknown error' }`)
    }
    return await this.waveDeviceConfigEntity.manager.transaction(async (manager) => {
      await manager.clear(WaveDeviceConfigEntity)
      for (const item of list) {
        const entity = new WaveDeviceConfigEntity()
        entity.createBy = uId
        entity.deviceModel = item.deviceModel
        entity.name = item.name
        entity.waveType = item.waveType
        entity.deviceType = item.deviceType
        entity.step_value = item.step_value
        entity.group = item.group
        entity.unit = item.unit
        entity.min_value = item.min_value
        entity.max_value = item.max_value
        entity.init_value = item.initValue
        entity.valueType = item.valueType
        await manager.save(entity)
      }
    })
  }

  async delete(id?: number) {
    if (id) {
      return await this.waveDeviceConfigEntity.delete(+id)
    }
    return await this.waveDeviceConfigEntity.clear()
  }

  async validate_wave_list(list: CreateWaveDeviceConfigDto[]) {
    const res = []
    let entites = await this.dict_item_service.page({})
    let dicts = entites?.items ?? []
    const isEmpty_name = !list.every(item => !!item.name)
    const isEmpty_deviceType = !list.every(item => !!item.deviceModel)
    const isEmpty_waveType = !list.every(item => !!item.waveType)
    const isEmpty_initValue = !list.every(item => !!item.initValue)
    const isRepeat_name = Object.keys(list.reduce((cur, pre, index) => {
      cur[`${pre.deviceModel}-${pre.waveType}-${pre.name}`] = pre
      if(!dicts.some(e => e.value == pre.deviceModel)) {
        res.push(`The "deviceModel" field of the ${ index }th element in the array is not in the dictionary.`)
      }
      if(!dicts.some(e => e.value == pre.deviceType)) {
        res.push(`The "deviceType" field of the ${ index }th element in the array is not in the dictionary.`)
      }
      if(!dicts.some(e => e.value == pre.valueType)) {
        res.push(`The "valueType" field of the ${ index }th element in the array is not in the dictionary.`)
      }
      if(!dicts.some(e => e.value == pre.waveType)) {
        res.push(`The "waveType" field of the ${ index }th element in the array is not in the dictionary.`)
      }
      return cur
    }, {})).length != list.length
    if (isEmpty_name) {
      res.push('name can not be empty in list')
    }
    if (isEmpty_deviceType) {
      res.push('deviceModel can not be empty in list')
    }
    if (isEmpty_waveType) {
      res.push('waveType can not be empty in list')
    }
    if (isRepeat_name) {
      res.push('name is repeat in list')
    }
    if (isEmpty_initValue) {
      res.push('initValue can not be empty in list')
    }
    return res
  }
}
