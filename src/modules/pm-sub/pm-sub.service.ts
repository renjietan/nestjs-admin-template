import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BusinessException } from "~/common/exceptions/biz.exception";
import { PMSubEntity } from "~/entities/pm_sub";
import { PMSubNetWorkDeviceEntity } from "~/entities/pm_sub_network_device";
import { paginate } from "~/helper/paginate";
import { CompleteDto } from "./dto/complete.dto";
import { SubNetWorkDeviceDto } from "./dto/sub-network-device.dto";
import { SubDto } from "./dto/sub.dto";

@Injectable()
export class PmSubService {
  constructor(
    @InjectRepository(PMSubEntity)
    private readonly pm_sub_entity: Repository<PMSubEntity>,
    @InjectRepository(PMSubNetWorkDeviceEntity)
    private readonly pm_sub_network_entity: Repository<PMSubNetWorkDeviceEntity>
  ) {}

  // TAG(2025-03-17 00:09:46 谭人杰): 子任务接口
  async search() {
    return await paginate(
      this.pm_sub_entity,
      { page: undefined, pageSize: undefined },
      {
        relations: {
          networks: true,
        },
      }
    );
  }

  async complete(mId: number, dto: CompleteDto, uId: number) {
    let entites = await this.findByName_sub(dto.sub.pm_sub_name)
    if(entites.length > 0 && dto.id != entites?.[0]?.id) throw new BusinessException("500:The name already exists")
    return await this.pm_sub_entity.manager.transaction(async (manager) => {
      let sub_entity = await manager.upsert(
        PMSubEntity,
        {
          id: dto.id,
          ...dto.sub,
          ...(dto.id ? { updateBy: 1 } : { createBy: 1 }),
          pm_master: {
            id: mId,
          },
        },
        ["id"]
      );
      let sub_id = sub_entity.identifiers?.[0]?.id;
      await manager
        .createQueryBuilder()
        .delete()
        .from(PMSubNetWorkDeviceEntity)
        .where("pm_sub_id = :pm_sub_id", {
          pm_sub_id: sub_id,
        })
        .execute();

      let networks = dto.networks.map((item) => ({
        ...item,
        pm_sub: {
          id: sub_id,
        },
        createBy: 1,
        updateBy: 1,
      }));
      await manager.save(PMSubNetWorkDeviceEntity, networks);
      return {
        id: sub_id,
        ...dto.sub,
        ...(dto.id ? { updateBy: dto.id } : { createBy: dto.id }),
        pm_master: {
          id: mId,
        },
        networks,
      };
    });
  }

  async create_sub(mId: number, dto: SubDto, uId: number) {
    return await this.pm_sub_entity.insert({
      pm_sub_name: dto.pm_sub_name,
      pm_sub_startTime: dto.pm_sub_startTime,
      pm_sub_endTime: dto.pm_sub_endTime,
      pm_sub_desc: dto.pm_sub_desc,
      createBy: uId,
      pm_master: {
        id: mId,
      },
    });
  }

  async update_sub(sub_id: number, dto: SubDto, uId: number) {
    return await this.pm_sub_entity
      .createQueryBuilder("pm_sub")
      .update(PMSubEntity)
      .set({
        pm_sub_name: dto.pm_sub_name,
        pm_sub_desc: dto.pm_sub_desc,
        pm_sub_startTime: dto.pm_sub_startTime,
        pm_sub_endTime: dto.pm_sub_endTime,
        updateBy: uId,
      })
      .where({
        id: sub_id,
      })
      .execute();
  }

  async delete_sub(id: number) {
    return await this.pm_sub_entity.delete(id);
  }

  async findByName_sub(name: string) {
    return await this.pm_sub_entity.findBy({
      pm_sub_name: name
    });
  }

  // TAG(2025-03-17 00:10:11 谭人杰):子任务-设备接口
  async create_network_device(
    sId: number,
    dto: SubNetWorkDeviceDto,
    uId: number
  ) {
    return await this.pm_sub_network_entity.insert({
      ip_addr: dto.ip_addr,
      network_addr: dto.network_addr,
      private_conf: dto.private_conf,
      isMaster: dto.isMaster,
      device: {
        id: dto.device_id,
      },
      pm_sub: {
        id: sId,
      },
      createBy: uId,
    });
  }

  async update_network_device(
    id: number,
    dto: SubNetWorkDeviceDto,
    uId: number
  ) {
    return await this.pm_sub_network_entity.update(id, {
      ip_addr: dto.ip_addr,
      network_addr: dto.network_addr,
      private_conf: dto.private_conf,
      isMaster: dto.isMaster,
      device: {
        id: dto.device_id,
      },
      updateBy: uId,
    });
  }

  async delete_network_device(id: number) {
    return await this.pm_sub_network_entity.delete(id);
  }
}
