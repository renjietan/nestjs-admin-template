import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { IdsDto } from '~/common/dto/ids.dto';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { PMMasterEntity } from '~/entities/pm_master';
import { paginate } from '~/helper/paginate';
import { PMMasterSearchDto } from './dto/pm-master-search.dto';
import { PMMasterDto } from './dto/pm-master.dto';

@Injectable()
export class PmMasterService {
    constructor(
        @InjectRepository(PMMasterEntity) private readonly pm_master_entity: Repository<PMMasterEntity>
    ) { }

    async search(dto: PMMasterSearchDto, isLike = true) {
        return paginate(this.pm_master_entity, { page: dto.page, pageSize: dto.pageSize }, {
            where: {
                ...(dto.pm_name && { pm_name: isLike ? Like(dto.pm_name) : dto.pm_name })
            }
        })
    }

    async create(dto: PMMasterDto, uId: number) {
        let isExist = await this.search({
            pm_name: dto.pm_name
        }, false)
        if (isExist.items.length > 0) {
            throw new BusinessException(ErrorEnum.DuplicateTaskTemplateName)
        }
        let _entity = new PMMasterEntity()
        _entity.createBy = uId
        _entity.pm_Desc = dto.pm_Desc
        _entity.pm_endTime = dto.pm_endTime
        _entity.pm_name = dto.pm_name
        _entity.pm_orgId = dto.pm_orgId
        _entity.pm_startTime = dto.pm_startTime
        return await this.pm_master_entity.save(_entity)
    }

    async update(id: number, dto: PMMasterDto, uId: number) {
        let isExist = await this.search(dto)
        if (isExist.items.length > 0) {
            throw new BusinessException(ErrorEnum.DuplicateTaskTemplateName)
        }
        return await this.pm_master_entity.createQueryBuilder().update(PMMasterEntity).set({
            ...dto,
            updateBy: uId
        }).where({
            id
        }).execute()
    }

    async delete(dto: IdsDto) {
        return await this.pm_master_entity.manager.transaction(async _manager => {
            return await _manager.delete(PMMasterEntity, dto?.ids ?? [])
        })
    }
}
