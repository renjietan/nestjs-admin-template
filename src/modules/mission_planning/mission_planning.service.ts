import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { Repository } from "typeorm";
import { I18nTranslations } from "types/i18n.generated";
import { BusinessException } from "~/common/exceptions/biz.exception";
import { MasterEntity } from "~/entities/t_master";
import { SubEntity } from "~/entities/t_sub";
import { SubDeviceEntity } from "~/entities/t_sub_device";
import { paginate } from "~/helper/paginate";
import { MasterDto, SubDto } from "./dto/mission_planning.dto";

@Injectable()
export class MissionPlanningService {
  constructor(
    @InjectRepository(MasterEntity)
    private readonly master_entity: Repository<MasterEntity>,
    @InjectRepository(SubEntity)
    private readonly sub_entity: Repository<SubEntity>,
    @InjectRepository(SubDeviceEntity)
    private readonly sub_device_entity: Repository<SubDeviceEntity>,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}
  async findAll() {
    return await paginate(this.master_entity, {
      page: undefined,
      pageSize: undefined,
    });
  }
  async create(dto: MasterDto, uId: number) {
    return this.master_entity.save({
      ...dto,
      createBy: uId,
    });
  }

  async update(id: number, dto: MasterDto, uId: number) {
    await this.master_entity
      .createQueryBuilder()
      .update(MasterEntity)
      .set({
        ...(!!dto.name && { name: dto.name }),
        ...(!!dto.startTime && { startTime: dto.startTime }),
        ...(!!dto.endTime && { endTime: dto.endTime }),
        ...(!!dto.region && { region: dto.region }),
        ...(!!dto.dscription && { dscription: dto.dscription }),
        ...(!!uId && { updateBy: uId }),
      })
      .where({
        id,
      })
      .execute();
  }

  async findById(id: number) {
    return await this.master_entity.findOneBy({ id });
  }

  async remove(id: number) {
    await this.master_entity.delete(id);
  }

  /** ======================== 子任务 =============================== */
  async create_sub(mId: number, dto: SubDto, uId: number) {
    let m_entity = await this.findById(mId);
    if (!m_entity)
      throw new BusinessException(
        this.i18n.t("index.Exist.MissionPlanningNotExists")
      );
    return this.sub_entity.save({
      ...dto,
      createBy: uId,
      devices: (dto?.devices ?? []).map(item => ({...item, createBy:uId})),
      master: m_entity,
    });
  }

  async update_sub(id: number, dto: SubDto,uId: number) {
    await this.remove_device(id)
    let sub_entity = await this.findSubById(id)
    if(!!sub_entity) {
      !!dto.name && (sub_entity.name = dto.name)
      !!dto.startTIme && (sub_entity.startTIme = dto.startTIme)
      !!dto.endTime && (sub_entity.endTime = dto.endTime)
      !!dto.dscription && (sub_entity.dscription = dto.dscription)
      !!dto.devices && (sub_entity.devices = (dto?.devices ?? []).map(item => ({...item, createBy:uId})))
      !!dto.createBy && (dto.createBy = uId)
      return await this.sub_entity.save(sub_entity)
    }
  }

  async findSubById(subId: number) {
    return await this.sub_entity.findOne({
      where: {
        id: subId,
      },
    });
  }

  async remove_sub(id: number) {
    await this.sub_entity.delete(id);
  }

  /** ======================== 设备列表 =============================== */
  async remove_device(subId: number) {
    await this.sub_device_entity.delete({
      sub: {
        id: subId,
      },
    });
  }

  async setDeviceMaster(deviceId: number) {
    await this.sub_device_entity.createQueryBuilder().update(SubDeviceEntity).set({
      isMaster: 0
    }).execute()
    await this.sub_device_entity.createQueryBuilder().update(SubDeviceEntity).set({
      isMaster: 1
    }).where({
      id: deviceId
    }).execute()
  }
}
