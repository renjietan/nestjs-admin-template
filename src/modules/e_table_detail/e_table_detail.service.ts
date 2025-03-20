import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Exact, Order } from "~/common/dto/pager.dto";
import { BusinessException } from "~/common/exceptions/biz.exception";
import { ETableEntity } from "~/entities/e_table";
import { ETableDetailEntity } from "~/entities/e_table_detail";
import { paginate } from "~/helper/paginate";
import { generateRandomString, toHexStringBy16Bit } from "~/utils";
import { DictItemService } from "../system/dict-item/dict-item.service";
import { BatchCreateEncryptDto } from "./dto/batchCreate.e.table.detail.dto";
import { CreateEncryptDto } from "./dto/create.e.table.detail.dto";
import { SearchEncryptDto } from "./dto/search.e.table.detail.dto";
import { UpdateEncryptDto } from "./dto/update.e.table.detail.dto";

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
        table: {
          id: data.table_id
        },
        isDelete: Exact.FALSE
      },
      order: {
        ...(data.field && data.order ? { [data.field]: data.order } : {channelNo: Order.ASC})
      },
      relations: {
        waveType: true
      }
    })
  }

  async insertRandomData(uId: number, data: BatchCreateEncryptDto) {
    return await this.encrypt_entity.manager.transaction(async (v) => {
      await this.deleteByTableId(data.table_id);
      let promise:Promise<ETableDetailEntity>[] = Array.from({
        length: data.length,
      }).map((item, index) => {
        let temp = new CreateEncryptDto();
        temp.channelNo = index + 1;
        temp.days = data.days;
        temp.startDate = data.startDate;
        temp.table_id = data.table_id;
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

  async create(uId: number, data: CreateEncryptDto) { 
    let encrypt = await this.encrypt_entity.createQueryBuilder('encrypt').where('encrypt.table_id = :table_id', {
      table_id: data.table_id,
    }).andWhere('encrypt.channelNo = :channelNo', {
      channelNo: data.channelNo,
    }).getOne();
    if (!!encrypt) throw new BusinessException("500:已存在相同的信道号");
    let dict_entites = await this.dict_item_service.validateDict({
      waveType: data.waveType
    })
    let temp = new ETableDetailEntity();
    temp.createBy = uId;
    temp.channelNo = data.channelNo;
    temp.encrypt_pwd = data.encrypt_pwd;
    temp.startDate = data.startDate;
    temp.days = data.days;
    temp.waveType = dict_entites.waveType
    temp.table = new ETableEntity()
    temp.table.id = data.table_id
    temp.isDelete = 0
    return await this.encrypt_entity.save(temp);
  }

  async update(id: number, data: UpdateEncryptDto) {
    let res = await this.encrypt_entity.findOne({
      where: {
        channelNo: data.channelNo,
      }
    })
    if(res?.id != id) throw new BusinessException("500:已存在相同的信道号")
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

  
  async updateByTableId(table_id: number, data: CreateEncryptDto) {
    return await this.encrypt_entity.update({
      table: {
        id: table_id
      }
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

  async deleteByTableId(table_id: number) {
    return await this.encrypt_entity
      .createQueryBuilder()
      .delete()
      .from(ETableDetailEntity)
      .where("table_id = :table_id", {
        table_id,
      })
      .execute();
  }

  generate_16bit() {
    let str = generateRandomString();
    return toHexStringBy16Bit(str);
  }
}


