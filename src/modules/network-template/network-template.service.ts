import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NetWorkTemplateDTO } from './dto/NetWorkTemplateDTO'
import { SearchNetWorkTemplateDto } from './dto/search.dto'
import { UpdateNetWorkTemplateDTO } from './dto/update.dto'
import { NNetWorkTemplateEntity } from '~/entities/n_network_template'
import { DictItemService } from '../system/dict-item/dict-item.service'
import { delChildren } from '~/utils/sql_str'

@Injectable()
export class NetworkTemplateService {
  constructor(
    @InjectRepository(NNetWorkTemplateEntity) private readonly network_template_entity: Repository<NNetWorkTemplateEntity>,
    private readonly dict_item_service: DictItemService,
  ) { }

  async create(uId: number, data: NetWorkTemplateDTO) {
    const find_params = new SearchNetWorkTemplateDto()
    find_params.name = data.name
    find_params.type = data?.type ?? 1
    const isExist = await this.findBy(find_params, false)
    if (isExist.length > 0) {
      throw new HttpException('The name is Exist', 500)
    }
    const entity = new NNetWorkTemplateEntity()
    entity.createBy = uId
    entity.name = data.name
    entity.pId = data.pId
    entity.type = data.type
    return await this.network_template_entity.save(entity)
  }

  async update(id: number, data: UpdateNetWorkTemplateDTO) {
    const find_params = new SearchNetWorkTemplateDto()
    find_params.name = data.name
    const isExist = await this.findBy(find_params, false)
    if (isExist.length > 0 && isExist[0]?.id != id) {
      throw new HttpException('The name is Exist', 500)
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
      access_method: dict_entites.access_method
    }).where({
      id,
    }).execute()
  }

  async findBy(data: SearchNetWorkTemplateDto, isLike = true) {
    return await this.network_template_entity.find({
      where: {
        ...(data.name && { name: data.name }),
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
