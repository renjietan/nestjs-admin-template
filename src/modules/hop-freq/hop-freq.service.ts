import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { PagerDto } from "~/common/dto/pager.dto";
import { BusinessException } from "~/common/exceptions/biz.exception";
import { ErrorEnum } from "~/constants/error-code.constant";
import { FHoppingEntity } from "~/entities/f-hopping";
import { FTableEntity } from "~/entities/f-table";
import { paginate } from "~/helper/paginate";
import { b_diff } from "~/utils";
import { hf_cof } from "./dict";
import {
  CreateFreqTableDto,
  CreateHzDtos,
  CreateTableDto,
} from "./dto/create-hf.dto";
import { SearchHFDto } from "./dto/search.dto";
import { UpdateTableDto } from "./dto/update-hf.dto";

@Injectable()
export class HopFreqService {
  constructor(
    @InjectRepository(FTableEntity)
    private readonly f_table_entity: Repository<FTableEntity>,
    @InjectRepository(FHoppingEntity)
    private readonly f_hopping_entity: Repository<FHoppingEntity>
  ) {}

  async init(dto: CreateFreqTableDto, uId: number) {
    let res = this.parseQueryDataByConf(dto, uId);
    let { create_count, data } = res;
    return await this.f_table_entity.manager.transaction(async (manager) => {
      await manager.query("SET FOREIGN_KEY_CHECKS = 0;");
      await manager.clear(FTableEntity);
      await manager.clear(FHoppingEntity);
      let exist_count = await this.f_table_entity.count();
      if (exist_count + create_count > 80)
        throw new BusinessException(ErrorEnum.DataLimitExceeded);
      let res = await manager.save(FTableEntity, data);
      await manager.query("SET FOREIGN_KEY_CHECKS = 1;");
      return res;
    });
  }

  async page(dto: SearchHFDto) {
    let query = this.f_table_entity
      .createQueryBuilder("f_table")
      .leftJoinAndSelect('f_table.type', 'type')
      .loadRelationCountAndMap("f_table.point_count", "f_table.hoppings")
    !!dto.alias &&
      query.where("f_table.alias LIKE :alias", { alias: `%${dto.alias}%` });
    !!dto.type && query.where("f_table.type = :type", { type: dto.type });
    !!dto.field &&
      !!dto.order ?
      query.orderBy(`f_table.${dto.field}`, dto.order) : query.orderBy(`f_table.alias`, "ASC");
    return await paginate(query, { page: dto.page, pageSize: dto.pageSize });
  }

  async pageByTableId(table_id, dto: PagerDto) {
    let table_entity = await this.findTableById(table_id);
    if (!table_entity)
      throw new BusinessException(ErrorEnum.HFTableNameNotExists);
    return await paginate(
      this.f_hopping_entity,
      { page: dto.page, pageSize: dto.pageSize },
      {
        where: {
          f_table: {
            id: table_id,
          },
        },
        relations: {
          f_table: false,
        },
        ...(dto.field && dto.order && { order: { [dto.field]: dto.order } }),
      }
    );
  }

  async create_hF(dto: CreateTableDto, uId: number) {
    let entity = new FTableEntity();
    entity.alias = dto.alias;
    entity.createBy = uId;
    entity.law_start = dto.law_start;
    entity.law_end = dto.law_end;
    entity.law_spacing = dto.law_spacing;
    entity.type = dto.type;
    return await this.f_table_entity.save(entity);
  }

  async update_hf(id: number, dto: UpdateTableDto, uid: number) {
    let entity = await this.f_table_entity.findOne({
      where: { id: Not(id), alias: dto.alias },
    });
    if (entity) throw new BusinessException(ErrorEnum.TableNameExists);
    await this.f_table_entity
      .createQueryBuilder()
      .update(FTableEntity)
      .set({
        ...dto,
        updateBy: uid,
      })
      .where({
        id,
      })
      .execute();
  }

  async delete_hf(id: number) {
    await this.f_table_entity.delete(id);
  }

  async findTableById(table_id: number) {
    return await this.f_table_entity.findOneBy({ id: table_id });
  }

  async create_hz(table_id: number, dto: CreateHzDtos, uId: number) {
    let table_entity = await this.findTableById(table_id);
    if (!table_entity)
      throw new BusinessException(ErrorEnum.HFTableNameNotExists);
    if (dto.allow_clean == 1)
      await this.f_hopping_entity
        .createQueryBuilder()
        .delete()
        .from(FHoppingEntity)
        .where("f_table_id = :f_table_id", { f_table_id: table_id })
        .execute();
    let entity_obj = dto.values.map((item) => ({
      value: item,
      f_table: table_entity,
      createBy: uId,
    }));
    await this.f_hopping_entity.insert(entity_obj);
  }

  parseQueryDataByConf(dto: CreateFreqTableDto, uId: number) {
    const law_conf = dto?.law_conf ?? [];
    let res = (law_conf.length == 0 ? Object.values(hf_cof) : law_conf).reduce(
      (cur, pre) => {
        if (!hf_cof[pre.type])
          throw new BusinessException(ErrorEnum.TypeNoLongerExists);
        let once_conf = hf_cof[pre.type];
        //单体 配置
        pre.point_count = pre.point_count
          ? pre.point_count
          : once_conf.point_count;
        pre.law_end = pre.law_end ? pre.law_end : once_conf.law_end;
        pre.law_start = pre.law_start ? pre.law_start : once_conf.law_start;
        if (!pre.law_spacing) {
          const _law_spacing = b_diff(
            pre.law_start,
            pre.law_end,
            pre.point_count,
            once_conf.law_spacing
          );
          pre.law_spacing = Number(
            Number(
              _law_spacing < once_conf.law_spacing
                ? once_conf.law_spacing
                : _law_spacing
            ).toFixed(3)
          );
        }
        let tables = Array.from({
          length: pre?.count,
        }).map((item, index) => {
          cur.alias_index++;
          let hoppings = Array.from({ length: pre.point_count }).map((e, i) => {
            const value = pre.law_start + index * pre.law_spacing;
            value > pre.law_end ? pre.law_end : value;
            return {
              value: Number(value.toFixed(3)),
              createBy: uId || 2,
            };
          });
          return {
            type: pre.type,
            alias: `Table No.${cur.alias_index}`,
            law_start: pre.law_start,
            law_end: pre.law_end,
            law_spacing: pre.law_spacing,
            createBy: uId || 1,
            hoppings: hoppings,
          };
        });
        cur.create_count = cur.create_count + pre.count;
        cur.data = [...cur.data, ...tables];
        return cur;
      },
      {
        alias_index: 0,
        data: [],
        create_count: 0,
      }
    );
    return res;
  }
}
