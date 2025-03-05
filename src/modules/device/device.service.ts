import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, FindManyOptions, FindOptionsOrder, Like, Not, Repository } from 'typeorm'
import { SearchDto } from './dto/search.dto'
import { DeviceDto } from './dto/device.dto'
import { DeviceEntity } from '~/entities/d_device'
import { IdsDto } from '~/common/dto/ids.dto'
import { DictItemEntity } from '~/entities/dict-item.entity'
import { DictItemService } from '../system/dict-item/dict-item.service'
import { paginate } from '~/helper/paginate'
import { createPaginationObject } from '~/helper/paginate/create-pagination'
import { PaginationTypeEnum } from '~/helper/paginate/interface'
import { getQueryField } from '~/utils'
import { Order } from '~/common/dto/pager.dto'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity) private readonly d_device_entity: Repository<DeviceEntity>,
  ) { }

  async search(data: SearchDto) {
    let _q: FindManyOptions<DeviceEntity> = {
      where: {
        ...(data.SN && { SN: Like(`%${data.SN}%`) }),
        ...(data.alias && { alias: Like(`%${data.alias}%`) }),
        ...(data.device_type && { device_type: data.device_type }),
        ...(data.model && { model: data.model }),
        ...(data.remarks && { remarks: Like(`%${data.remarks}%`) }),
        ...(data.status && { SN: data.status }),
      },
      order: {
        [!!data.field ? data.field : "createdAt"]: !!data.order ? data.order : Order.DESC
      },
    }
    return await paginate(this.d_device_entity, { page: data.page, pageSize: data.pageSize }, _q)
  }

  async create(data: DeviceDto, userId: number) {
    const exist = await this.d_device_entity.findOne({
      where: [{
        SN: data.SN,
      }, {
        alias: data.alias,
      }],
    })
    if (exist) {
      throw new HttpException('The device is exist', 500)
    }
    const data_base = new DeviceEntity()
    data_base.SN = data.SN
    data_base.alias = data.alias
    data_base.device_type = data.device_type
    data_base.model = data.model
    data_base.remarks = data.remarks
    data_base.createBy = userId
    data_base.status = data.status
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
      throw new HttpException('The device is exist', 500)
    }
    let device_type = new DictItemEntity()
    device_type.value = data.device_type
    return await this.d_device_entity.createQueryBuilder().update(DeviceEntity).set({
      SN: data.SN,
      alias: data.alias,
      device_type: data.device_type,
      model: data.model,
      remarks: data.remarks,
      updateBy: userId,
      status: data.status,
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
    })
  }
}
