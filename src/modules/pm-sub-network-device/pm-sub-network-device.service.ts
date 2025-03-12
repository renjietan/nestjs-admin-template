import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DeviceService } from '../device/device.service'
import { BatchPMSubNetWorkDeviceDto } from './dto/batch-pm-sub_network-device.dto.'
import { PMSubNetWorkDeviceDto } from './dto/pm-sub_network-device.dto'
import { PMSubNetWorkDeviceEntity } from '~/entities/pm_sub_network_device'
import { PMSubEntity } from '~/entities/pm_sub'
import { IdsDto } from '~/common/dto/ids.dto'
import { BusinessException } from '~/common/exceptions/biz.exception'

@Injectable()
export class PmSubNetWorkDeviceService {
  constructor(
        @InjectRepository(PMSubNetWorkDeviceEntity) private readonly pm_sub_network_device_entity: Repository<PMSubNetWorkDeviceEntity>,
        @InjectRepository(PMSubEntity) private readonly pm_sub_entity: Repository<PMSubEntity>,
        private readonly d_device_service: DeviceService,
  ) { }

  async create(data: PMSubNetWorkDeviceDto, pm_sub_id: number, uId: number) {
    const pm_sub_entity = await this.findOneById_PM(pm_sub_id)
    if (!pm_sub_entity) {
      throw new BusinessException('500:The subtask does not exist')
    }
    const device_entity = await this.d_device_service.findById(data.deviceId)
    if (!device_entity) {
      throw new BusinessException('500:The device does not exist')
    }
    const network_device_entity = this.pm_sub_network_device_entity.create({
      ...data,
      pmSub: pm_sub_entity,
      device: device_entity,
      createBy: uId,
    })
    return await this.pm_sub_network_device_entity.save(network_device_entity)
  }

  async batchCreate(pm_sub_id: number, data: BatchPMSubNetWorkDeviceDto, uId: number) {
    const pm_sub_entity = await this.pm_sub_entity.findOne({
      where: {
        id: pm_sub_id,
      },
    })
    if (!pm_sub_entity) {
      throw new BusinessException('500:The subtask does not exist')
    }
    return await this.pm_sub_network_device_entity.manager.transaction(async (manager) => {
      await this.deleteByPmId(pm_sub_id)
      const _data = data.data
      for (const item of _data) {
        const device_entity = await this.d_device_service.findById(item.deviceId)
        if (!device_entity) {
          throw new BusinessException('500:The device does not exist')
        }
        const network_device_entity = this.pm_sub_network_device_entity.create({
          ...item,
          pmSub: pm_sub_entity,
          device: device_entity,
          createBy: uId
        })
        await this.pm_sub_network_device_entity.save(network_device_entity)
      }
    })
  }

  async delete(data: IdsDto) {
    const _ids = data?.ids ?? []
    return await this.pm_sub_network_device_entity.manager.transaction(async (manager) => {
      return await manager.delete(PMSubNetWorkDeviceEntity, _ids)
    })
  }

  async deleteByPmId(pm_sub_id: number) {
    return await this.pm_sub_network_device_entity.delete({
      pmSub: {
        id: pm_sub_id
      }
    })
  }

  async findOneById_PM(pm_sub_id: number) {
    return await this.pm_sub_entity.findOne({
      where: {
        id: pm_sub_id,
      },
    })
  }
}
