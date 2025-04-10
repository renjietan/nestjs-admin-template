import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { Repository } from "typeorm";
import { I18nTranslations } from "types/i18n.generated";
import { BusinessException } from "~/common/exceptions/biz.exception";
import { MasterEntity } from "~/entities/t_master";
import { SubEntity } from "~/entities/t_sub";
import { SubDeviceEntity } from "~/entities/t_sub_device";
import { SubHopEntity } from "~/entities/t_sub_hop";
import { paginate } from "~/helper/paginate";
import { MasterDto, SubDto, SubHopUpdateDto } from "./dto/mission_planning.dto";

@Injectable()
export class MissionPlanningService {
  constructor(
    @InjectRepository(MasterEntity)
    private readonly master_entity: Repository<MasterEntity>,
    @InjectRepository(SubEntity)
    private readonly sub_entity: Repository<SubEntity>,
    @InjectRepository(SubDeviceEntity)
    private readonly sub_device_entity: Repository<SubDeviceEntity>,
    @InjectRepository(SubHopEntity)
    private readonly sub_hop_entity: Repository<SubHopEntity>,
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
      updateBy: uId,
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
  async findSubList(mId: number) {
    return await this.sub_entity.find({
      where: {
        master: {
          id: mId,
        },
      },
      relations: {
        devices: true,
        time_slots: true,
        hops: true,
        encrypts: true
      },
    });
  }
  async create_sub(mId: number, dto: SubDto, uId: number) {
    let m_entity = await this.findById(mId);
    if (!m_entity)
      throw new BusinessException(
        this.i18n.t("index.Exist.MissionPlanningNotExists")
      );
    console.log({
      ...dto,
      createBy: uId,
      devices: (dto?.devices ?? []).map((item) => ({
        ...item,
        createBy: uId,
        updateBy: uId,
      })),
      hops: (dto?.hops ?? []).map((item) => ({
        ...item,
        createBy: uId,
        updateBy: uId,
      })),
      time_slots: (dto?.time_slots ?? []).map((item) => ({
        ...item,
        createBy: uId,
        updateBy: uId,
      })),
      encrypts: (dto?.encrypts ?? []).map((item) => ({
        ...item,
        createBy: uId,
        updateBy: uId,
      })),
      master: m_entity,
    });

    return this.sub_entity.save({
      ...dto,
      createBy: uId,
      devices: (dto?.devices ?? []).map((item) => ({
        ...item,
        createBy: uId,
        updateBy: uId,
      })),
      hops: (dto?.hops ?? []).map((item) => ({
        ...item,
        createBy: uId,
        updateBy: uId,
      })),
      time_slots: (dto?.time_slots ?? []).map((item) => ({
        ...item,
        createBy: uId,
        updateBy: uId,
      })),
      encrypts: (dto?.encrypts ?? []).map((item) => ({
        ...item,
        createBy: uId,
        updateBy: uId,
      })),
      master: m_entity,
    });
  }

  async update_sub(id: number, dto: SubDto, uId: number) {
    await this.sub_entity.manager.transaction(async (manager) => {
      let sub_entity = await this.findSubById(id);
      await manager.delete(SubDeviceEntity, { sub: sub_entity });
      await manager.delete(SubHopEntity, { sub: sub_entity });
      if (!!sub_entity) {
        !!dto.name && (sub_entity.name = dto.name);
        !!dto.startTIme && (sub_entity.startTIme = dto.startTIme);
        !!dto.endTime && (sub_entity.endTime = dto.endTime);
        !!dto.dscription && (sub_entity.dscription = dto.dscription);
        !!dto.devices &&
          (sub_entity.devices = (dto?.devices ?? []).map((item) => {
            let temp = new SubDeviceEntity();
            temp.createBy = uId;
            temp.updateBy = uId;
            temp.IP = item.IP;
            temp.MAC = item.MAC;
            temp.SN = item.SN;
            temp.conf = item.conf;
            temp.gatewayIP = item.gatewayIP;
            temp.isMaster = item.isMaster;
            temp.sub = sub_entity;
            return temp;
          }));

        !!dto.hops &&
          (sub_entity.hops = (dto?.hops ?? []).map((item) => {
            let temp = new SubHopEntity();
            temp.createBy = uId;
            temp.updateBy = uId;
            temp.alias = item.alias;
            temp.points = item.points;
            temp.sub = sub_entity;
            temp.type = item.type;
            return temp;
          }));

        sub_entity.updateBy = uId;
        return await manager.save(sub_entity);
      }
      return this.i18n.t("index.System.OperationSuccess");
    });
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

  async setDeviceMaster(deviceId: number) {
    await this.sub_device_entity
      .createQueryBuilder()
      .update(SubDeviceEntity)
      .set({
        isMaster: 0,
      })
      .execute();
    await this.sub_device_entity
      .createQueryBuilder()
      .update(SubDeviceEntity)
      .set({
        isMaster: 1,
      })
      .where({
        id: deviceId,
      })
      .execute();
  }

  /** ======================== 跳频表 =============================== */
  async update_hop(id: number, dto: SubHopUpdateDto) {
    return this.sub_hop_entity
      .createQueryBuilder()
      .update(SubHopEntity)
      .set({
        ...(!!dto.alias && { alias: dto.alias }),
        ...(!!dto.points && { points: dto.points }),
        ...(!!dto.type && { type: dto.type }),
      })
      .where({
        id,
      })
      .execute();
  }

  async delete(id: number) {
    return this.sub_hop_entity.delete(id);
  }

  async removeHopBySubId(id: number) {
    return this.sub_hop_entity.delete({
      sub: {
        id: id,
      },
    });
  }
}
