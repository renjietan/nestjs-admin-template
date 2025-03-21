import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { NNetWorkTemplateEntity } from '~/entities/n_network_template'
import { paginate } from '~/helper/paginate'
import { delChildren } from '~/utils/sql_str'
import { DictItemService } from '../system/dict-item/dict-item.service'
import { NetWorkTemplateDTO } from './dto/NetWorkTemplateDTO'
import { SearchNetWorkTemplateDto } from './dto/search.dto'
import { UpdateNetWorkTemplateDTO } from './dto/update.dto'

@Injectable()
export class NetworkTemplateService {
  constructor(
    @InjectRepository(NNetWorkTemplateEntity) private readonly network_template_entity: Repository<NNetWorkTemplateEntity>,
    private readonly dict_item_service: DictItemService,
  ) { }

  async create(uId: number, data: NetWorkTemplateDTO) {
    const entities = await this.findBy({
      name: data.name,
      type: data?.type ?? 1
    }, false)
    if (entities.meta.itemCount > 0) {
      throw new BusinessException(ErrorEnum.DuplicateNetworkTemplateName)
    }
    const entity = new NNetWorkTemplateEntity()
    entity.createBy = uId
    entity.name = data.name
    entity.pId = data.pId
    entity.type = data.type
    entity.createBy = uId
    return await this.network_template_entity.save(entity)
  }

  async update(id: number, data: UpdateNetWorkTemplateDTO, uId: number) {
    const entities = await this.findBy({
      name: data.name,
      type: data?.type ?? 1
    }, false)
    if (entities.meta.itemCount > 0 && entities?.items?.[0]?.id != id) {
      throw new BusinessException(ErrorEnum.DuplicateNetworkTemplateName)
    }
    let dict_entites = await this.dict_item_service.validateDict({
      waveForm: data.waveForm,
      device_type: data.device_type,
      access_method: data.access_method
    })
    return await this.network_template_entity.createQueryBuilder().update(NNetWorkTemplateEntity).set({
      ...data,
      waveForm: dict_entites.waveForm,
      device_type: dict_entites.device_type,
      access_method: dict_entites.access_method,
      updateBy: uId
    }).where({
      id,
    }).execute()
  }

  async findBy(data: SearchNetWorkTemplateDto, isLike = true) {
    return paginate(this.network_template_entity, {
      page: undefined,
      pageSize: undefined
    }, {
      where: {
        ...(data.name && { name: isLike ? Like(data.name) : data.name }),
        ...(data.type && { type: data.type }),
      },
      relations: {
        device_type: true,
        access_method: true,
        waveForm: true
      }
    })
  }

  async delete(id: number) {
    const sql = delChildren('n_network_template', id)
    return await this.network_template_entity.query(sql)
  }
}
