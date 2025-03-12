import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { SearchEncryptDto } from "./dto/search.e.table.detail.dto";
import { CreateEncryptDto } from "./dto/create.e.table.detail.dto";
import { BatchCreateEncryptDto } from "./dto/batchCreate.e.table.detail.dto";
import { UpdateEncryptDto } from "./dto/update.e.table.detail.dto";
import { UpdateETableDto } from "../e_table/dto/update.e.table.dto";
import { ETableDetailEntity } from "~/entities/e_table_detail";
import { generateRandomString, toHexStringBy16Bit } from "~/utils";
import { BusinessException } from "~/common/exceptions/biz.exception";
import { paginate } from "~/helper/paginate";
import { Order } from "~/common/dto/pager.dto";
import { DictItemService } from "../system/dict-item/dict-item.service";

@Injectable()
export class ETableDetailService {
  constructor(
    @InjectRepository(ETableDetailEntity) private readonly encrypt_entity: Repository<ETableDetailEntity>,
    private readonly dict_item_service: DictItemService
  ) {}

  async search(data: SearchEncryptDto) {
    return paginate(this.encrypt_entity, { 
      page: data.page,
      pageSize: data.pageSize
    }, {
      where: {
        tableId: data.tableId,
        isDelete: 0
      },
      order: {
        ...(data.field && data.order ? { [data.field]: data.order } : {channelNo: Order.ASC})
      },
      relations: {
        waveType: true
      }
    })
  }

  async create(uId: number, data: CreateEncryptDto) {
    let encrypt = await this.encrypt_entity.createQueryBuilder('encrypt').where('encrypt.tableId = :tableId', {
      tableId: data.tableId,
    }).andWhere('encrypt.channelNo = :channelNo', {
      channelNo: data.channelNo,
    }).getOne();
    if (!!encrypt) throw new BusinessException("500:信道号已被分配");
    let dict_entites = await this.dict_item_service.validateDict({
      waveType: data.waveType
    })
    let temp = new ETableDetailEntity();
    temp.channelNo = data.channelNo;
    temp.encrypt_pwd = data.encrypt_pwd;
    temp.createBy = uId;
    temp.tableId = data.tableId;
    temp.startDate = data.startDate;
    temp.days = data.days;
    temp.waveType = dict_entites.waveType
    temp.isDelete = 0
    return await this.encrypt_entity.save(temp);
  }

  async insertRandomData(uId: number, data: BatchCreateEncryptDto) {
    return await this.encrypt_entity.manager.transaction(async (v) => {
      await this.deleteByTableId(data.tableId);
      let promise = Array.from({
        length: data.length,
      }).map((item, index) => {
        let temp = new CreateEncryptDto();
        temp.channelNo = index + 1;
        temp.createById = uId;
        temp.days = data.days;
        temp.startDate = data.startDate;
        temp.tableId = data.tableId;
        temp.waveType = data.waveType
        let random_encrypt_pwd = Array.from({ length: 32 }).map((item) =>
          this.generate_16bit()
        );
        temp.encrypt_pwd = random_encrypt_pwd.join("");
        return this.create(uId, temp);
      });
      return await Promise.all(promise);
    });
  }

  async update(id: number, data: UpdateEncryptDto) {
    return await this.encrypt_entity
      .createQueryBuilder()
      .update(ETableDetailEntity)
      .set({
        encrypt_pwd: data.encrypt_pwd,
        channelNo: data.channelNo,
        isDelete: data.isDelete
      })
      .where({
        id,
      })
      .execute();
  }

  
  async updateByTableId(tableId: number, data: CreateEncryptDto) {
    return await this.encrypt_entity.update({
      tableId
    }, {
      ...data,
      waveType: {
        value: data.waveType
      }
    })
  }

  async delete(id: number) {
    return await this.encrypt_entity
      .createQueryBuilder()
      .delete()
      .from(ETableDetailEntity)
      .where("id = :id", {
        id,
      })
      .execute();
  }

  async deleteByTableId(tableId: number) {
    return await this.encrypt_entity
      .createQueryBuilder()
      .delete()
      .from(ETableDetailEntity)
      .where("tableId = :tableId", {
        tableId,
      })
      .execute();
  }

  generate_16bit() {
    let str = generateRandomString();
    return toHexStringBy16Bit(str);
  }
}


