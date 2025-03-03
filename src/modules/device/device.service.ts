import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Not, Repository } from 'typeorm'
import { SearchDto } from './dto/search.dto'
import { DeviceDto } from './dto/device.dto'
import { DeviceEntity } from '~/entities/d_device'
import { IdsDto } from '~/common/dto/ids.dto'
import { DictItemEntity } from '~/entities/dict-item.entity'
import { DictItemService } from '../system/dict-item/dict-item.service'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity) private readonly d_device_entity: Repository<DeviceEntity>,
    
  ) { }

  async search(data: SearchDto) {
    let qb = this.d_device_entity.createQueryBuilder('d_device').andWhere(new Brackets((qb) => {
      if (data.SN) {
        return qb.where('d_device.SN like :SN', { SN: `%${data.SN}%` })
      }
      return qb
    })).andWhere(new Brackets((qb) => {
      if (data.alias) {
        return qb.where('d_device.alias like :alias', { alias: `%${data.alias}%` })
      }
      return qb
    })).andWhere(new Brackets((qb) => {
      if (data.device_type) {
        return qb.where('d_device.device_type = :device_type', { device_type: data.device_type })
      }
      return qb
    })).andWhere(new Brackets((qb) => {
      if (data.model) {
        return qb.where('d_device.model = :model', { model: data.model })
      }
      return qb
    })).andWhere(new Brackets((qb) => {
      if (data.remarks) {
        return qb.where('d_device.remarks like :remarks', { remarks: `%${data.remarks}%` })
      }
      return qb
    })).andWhere(new Brackets((qb) => {
      if (data.status) {
        return qb.where('d_device.status = :status', { status: data.status })
      }
      return qb
    }))
    if (!!data.pageNum && !!data.pageSize) {
      qb = qb.skip((Number(data.pageNum) - 1) * Number(data.pageSize)).take(Number(data.pageSize))
    }
    const res = await qb // 最后按createTime降序排
      .leftJoinAndSelect("d_device.device_type", "sys_dict_item")
      .leftJoinAndSelect("d_device.model", "sys_dict_item")
      .leftJoinAndSelect("d_device.status", "sys_dict_item")
      .addOrderBy('d_device.createTime', 'DESC')
      .getManyAndCount()
    return {
      list: res[0],
      total: res[1],
    }
  }

  // async create(data: DeviceDto, userId: number) {
  //   const exist = await this.d_device_entity.findOne({
  //     where: [{
  //       SN: data.SN,
  //     }, {
  //       alias: data.alias,
  //     }],
  //   })
  //   if (exist) {
  //     throw new HttpException('The device is exist', 500)
  //   }
  //   const data_base = new DeviceEntity()
  //   data_base.SN = data.SN
  //   data_base.alias = data.alias
  //   data_base.device_type = new DictItemEntity()
  //   data_base.device_type.value = data.device_type
  //   data_base.model = new DictItemEntity()
  //   data_base.model.value = data.model
  //   data_base.remarks = data.remarks
  //   data_base.createBy = userId
  //   data_base.status = new DictItemEntity()
  //   data_base.status.value = data.status
  //   return await this.d_device_entity.save(data_base)
  // }

  // async update(id: number, data: DeviceDto, userId: number) {
  //   const exist = await this.d_device_entity.findOne({
  //     where: [{
  //       SN: data.SN,
  //       id: Not(id),
  //     }, {
  //       alias: data.alias,
  //       id: Not(id),
  //     }],
  //   })
  //   if (exist) {
  //     throw new HttpException('The device is exist', 500)
  //   }
  //   let device_type = new DictItemEntity()
  //   device_type.value = data.device_type
  //   let model = new DictItemEntity()
  //   return await this.d_device_entity.createQueryBuilder().update(DeviceEntity).set({
  //     SN: data.SN,
  //     alias: data.alias,
  //     device_type: data.device_type,
  //     model: data.model,
  //     remarks: data.remarks,
  //     updateBy: userId,
  //     status: data.status,
  //   }).where({
  //     id,
  //   }).execute()
  // }

  // async remove(data: IdsDto) {
  //   const _ids = data?.ids ?? []
  //   return await this.d_device_entity.manager.transaction(async (manager) => {
  //     return await manager.delete(DeviceEntity, _ids)
  //   })
  // }

  // async findById(id: number) {
  //   return await this.d_device_entity.findOne({
  //     where: {
  //       id,
  //     },
  //   })
  // }
}
