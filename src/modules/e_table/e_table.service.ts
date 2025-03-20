import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BusinessException } from "~/common/exceptions/biz.exception";
import { ErrorEnum } from "~/constants/error-code.constant";
import { ETableEntity } from "~/entities/e_table";
import { paginate } from "~/helper/paginate";
import { BatchCreateEncryptDto } from "../e_table_detail/dto/batchCreate.e.table.detail.dto";
import { CreateEncryptDto } from "../e_table_detail/dto/create.e.table.detail.dto";
import { ETableDetailService } from "../e_table_detail/e_table_detail.service";
import { DictItemService } from "../system/dict-item/dict-item.service";
import { CreateETableDto } from "./dto/create.e.table.dto";
import { UpdateETableDto } from "./dto/update.e.table.dto";

@Injectable()
export class ETableService {
  constructor(
    @InjectRepository(ETableEntity)
    private readonly e_table_entity: Repository<ETableEntity>,
    private readonly e_table_entity_detail_service: ETableDetailService,
    private readonly dict_item_service: DictItemService
  ) {}

  async search() {
    return paginate(
      this.e_table_entity,
      { page: undefined, pageSize: undefined },
      {
        relations: {
          waveType: true,
          details: true,
        },
      }
    );
  }

  async create(uId: number, data: CreateETableDto) {
    return await this.e_table_entity.manager.transaction(async (manager) => {
      let table = await this.e_table_entity.findOne({
        where: {
          name: data.name,
        },
      });
      if (!!table)
        throw new BusinessException(ErrorEnum.TableNameExists);
      let dict_entites = await this.dict_item_service.validateDict({
        waveType: data.waveType,
      });
      let temp = new ETableEntity();
      temp.name = data.name;
      temp.startDate = data.startDate;
      temp.days = data.days;
      temp.waveType = dict_entites.waveType;
      temp.createBy = uId;
      let res = await this.e_table_entity.save(temp);
      if (data.g_random == 1) {
        let batch_params_detial = new BatchCreateEncryptDto();
        batch_params_detial.table_id = res.id;
        batch_params_detial.days = data.days;
        batch_params_detial.length = data.r_size;
        batch_params_detial.startDate = data.startDate;
        batch_params_detial.waveType = dict_entites.waveType.value;
        let details = await this.e_table_entity_detail_service.insertRandomData(
          uId,
          batch_params_detial
        );
        return {
          ...res,
          details,
        };
      }
      return res;
    });
  }

  async update(id: number, data: UpdateETableDto, uId: number) {
    let dict_entites = await this.dict_item_service.validateDict({
      waveType: data.waveType,
    });
    return await this.e_table_entity.manager.transaction(async () => {
      await this.e_table_entity
        .createQueryBuilder()
        .update(ETableEntity)
        .set({
          name: data.name,
          startDate: data.startDate,
          days: data.days,
          waveType: dict_entites.waveType,
          updateBy: uId,
        })
        .where({
          id,
        })
        .execute();
      let _data = new CreateEncryptDto();
      _data.days = data.days;
      _data.startDate = data.startDate;
      _data.waveType = data.waveType;
      return await this.e_table_entity_detail_service.updateByTableId(
        uId,
        _data
      );
    });
  }

  async delete(id: number) {
    try {
      return await this.e_table_entity.manager.transaction(async () => {
        await this.e_table_entity.delete(id);
        await this.e_table_entity_detail_service.deleteByTableId(id);
        return ErrorEnum.OperationSuccess;
      });
    } catch (error) {
      throw new BusinessException(ErrorEnum.OperationFailed);
    }
  }
}
