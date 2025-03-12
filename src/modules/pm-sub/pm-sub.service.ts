import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { PmSubNetWorkDeviceService } from '../pm-sub-network-device/pm-sub-network-device.service'
import { PMSubDto } from './dto/pm-sub.dto'
import { BasePMSubDto } from './dto/base-pm-sub.dto'
import { BatchPmSubDto } from './dto/batch-pm-sub.dto'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { PMSubEntity } from '~/entities/pm_sub'
import { IdsDto } from '~/common/dto/ids.dto'
import { paginate } from '~/helper/paginate'

@Injectable()
export class PmSubService {
  constructor(
    @InjectRepository(PMSubEntity) private readonly pm_sub_entity: Repository<PMSubEntity>,
    private readonly pmSubNetWorkDeviceService: PmSubNetWorkDeviceService,
  ) { }

  async create(data: PMSubDto, uId: number) {
    const exist = await this.pm_sub_entity.exist({
      where: [data.pm_sub_id
        ? {
          pm_sub_name: data.pm_sub_name,
          id: Not(data.pm_sub_id),
        }
        : {
          pm_sub_name: data.pm_sub_name,
        }],
    })
    if (exist) {
      throw new BusinessException('500:The SubTask name does exist')
    }
    return await this.pm_sub_entity.manager.transaction(async (manager) => {
      let _id = 0
      if (data.pm_sub_id) {
        await this.updateBase(data, uId)
        _id = data.pm_sub_id
      }
      else {
        const res = await this.createBase(data, uId)
        _id = res.id
      }
      return await this.pmSubNetWorkDeviceService.batchCreate(_id, {
        data: data.devices,
      }, uId)
    })
  }

  async batchCreate(data: BatchPmSubDto, uId: number) {
    try {
      return await this.pm_sub_entity.manager.transaction(async manager => {
        for (const element of (data?.list ?? [])) {
          await this.create(element, uId)
        }
      })
    } catch (error) {
      new HttpException(`${ error }`, 500)
    }
  }

  async createBase(data: BasePMSubDto, uId: number) {
    const pm_sub_entity = new PMSubEntity()
    pm_sub_entity.createBy = uId
    pm_sub_entity.pm_sub_Desc = data.pm_sub_desc
    pm_sub_entity.pm_sub_endTime = data.pm_sub_endTime
    pm_sub_entity.pm_sub_name = data.pm_sub_name
    pm_sub_entity.pm_sub_startTime = data.pm_sub_startTime
    return await this.pm_sub_entity.save(pm_sub_entity)
  }

  async updateBase(data: BasePMSubDto, uId: number) {
    return await this.pm_sub_entity.createQueryBuilder('pm_sub').update(PMSubEntity).set({
      pm_sub_name: data.pm_sub_name,
      pm_sub_Desc: data.pm_sub_desc,
      pm_sub_startTime: data.pm_sub_startTime,
      pm_sub_endTime: data.pm_sub_endTime,
      updateBy: uId
    }).where({
      id: data.pm_sub_id,
    }).execute()
  }

  async search() {
    return paginate(this.pm_sub_entity, {
      page: undefined,
      pageSize: undefined
    }, {
      relations: ['networkDevices']
    })
  }

  async findByName(pm_sub_name: string) {
    return await this.pm_sub_entity.findOne({
      where: {
        pm_sub_name,
      },
    })
  }

  async delete(data: IdsDto) {
    return await this.pm_sub_entity.manager.transaction((manager) => {
      return manager.delete(PMSubEntity, data?.ids ?? [])
    })
  }
}
