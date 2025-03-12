import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Like, Not, Repository } from 'typeorm'
import { SearchDto } from './dto/search.dto'
import { DeviceDto } from './dto/device.dto'
import { DeviceEntity } from '~/entities/d_device'
import { IdsDto } from '~/common/dto/ids.dto'
import { paginate } from '~/helper/paginate'
import { Order } from '~/common/dto/pager.dto'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { DictItemEntity } from '~/entities/dict-item.entity'
import { DictItemService } from '../system/dict-item/dict-item.service'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity) private readonly d_device_entity: Repository<DeviceEntity>,
    private readonly dict_item_service: DictItemService
  ) { }

  async search(data: SearchDto) {
    let _q: FindManyOptions<DeviceEntity> = {
      where: {
        ...(data.SN && { SN: Like(`%${data.SN}%`) }),
        ...(data.alias && { alias: Like(`%${data.alias}%`) }),
        ...(data.remarks && { remarks: Like(`%${data.remarks}%`) }),
        ...(data.device_type && { device_type: { value: data.device_type } }),
        ...(data.model && { model: { value: data.model } }),
        ...(data.status && { status: { value: data.status } }),
      },
      order: {
        [!!data.field ? data.field : "createdAt"]: !!data.order ? data.order : Order.DESC
      },
      relations: {
        status: true,
        device_type: true,
        model: true
      }
    }
    return await paginate(this.d_device_entity, { page: data.page, pageSize: data.pageSize }, _q)
  }

  async create(data: DeviceDto, uId: number) {
    const exist = await this.d_device_entity.findOne({
      where: [{
        SN: data.SN,
      }, {
        alias: data.alias,
      }],
    })
    if (exist) {
      throw new BusinessException('The device is exist')
    }
    let dict_entites =  await this.dict_item_service.validateDict({
      device_type: data.device_type,
      model: data.model,
      status: data.status
    })
    const data_base = new DeviceEntity()
    data_base.SN = data.SN
    data_base.alias = data.alias
    data_base.remarks = data.remarks
    data_base.createBy = uId
    data_base.device_type = dict_entites.device_type
    data_base.model = dict_entites.model
    data_base.status = dict_entites.status
    return await this.d_device_entity.save(data_base)
  }

  async update(id: number, data: DeviceDto, userId: number) {
    const exist = await this.d_device_entity.findOne({
      where: [{
        SN: data.SN,
        id: Not(id),
      }, {
        alias: data.alias,
        id: Not(id),
      }],
    })
    if (exist) {
      throw new BusinessException('The device is exist')
    }
    await this.dict_item_service.validateDict({
      device_type: data.device_type,
      model: data.model,
      status: data.status
    })
    return await this.d_device_entity.createQueryBuilder().update(DeviceEntity).set({
      SN: data.SN,
      alias: data.alias,
      device_type: {
        value: data.device_type
      },
      model: {
        value: data.model
      },
      remarks: data.remarks,
      updateBy: userId,
      status: {
        value: data.status
      },
    }).where({
      id,
    }).execute()
  }

  async remove(data: IdsDto) {
    const _ids = data?.ids ?? []
    return await this.d_device_entity.manager.transaction(async (manager) => {
      return await manager.delete(DeviceEntity, _ids)
    })
  }

  async findById(id: number) {
    return await this.d_device_entity.findOne({
      where: {
        id,
      },
      relations: {
        device_type: true,
        model: true,
        status: true
      }
    })
  }


}
