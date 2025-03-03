import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Not, Repository } from 'typeorm'
import { SearchDto } from './dto/search.dto'
import { DeviceDto } from './dto/device.dto'
import { DeviceEntity } from '~/entities/d_device'
import { IdsDto } from '~/common/dto/ids.dto'
import { DictItemEntity } from '~/entities/dict-item.entity'
import { DictItemService } from '../system/dict-item/dict-item.service'
import { paginate } from '~/helper/paginate'
import { createPaginationObject } from '~/helper/paginate/create-pagination'
import { PaginationTypeEnum } from '~/helper/paginate/interface'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity) private readonly d_device_entity: Repository<DeviceEntity>,

  ) { }

  async search(data: SearchDto) {
    return paginate(this.d_device_entity, { page: data.page, pageSize: data.pageSize }, data)
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
    let model = new DictItemEntity()
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
