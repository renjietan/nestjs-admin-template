import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Not, Repository } from "typeorm";
import { PagerDto } from "~/common/dto/pager.dto";
import { BusinessException } from "~/common/exceptions/biz.exception";
import { ErrorEnum } from "~/constants/error-code.constant";
import { FHoppingEntity } from "~/entities/f-hopping";
import { FTableEntity } from "~/entities/f-table";
import { paginate } from "~/helper/paginate";
import { CreateHzDtos, CreateTableDto } from "./dto/create-hf.dto";
import { SearchHFDto } from "./dto/search.dto";
import { UpdateTableDto } from "./dto/update-hf.dto";

@Injectable()
export class HopFreqService {
  constructor(
    @InjectRepository(FTableEntity)
    private readonly f_table_entity: Repository<FTableEntity>,
    @InjectRepository(FHoppingEntity)
    private readonly f_hopping_entity: Repository<FHoppingEntity>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly entity_manager: EntityManager
  ) {}

  async page(dto: SearchHFDto) {
    let query = this.f_table_entity
      .createQueryBuilder("f_table")
      .loadRelationCountAndMap("f_table.point_count", "f_table.hoppings")
      !!dto.alias && query.where('f_table.alias LIKE :alias', { alias: `%${ dto.alias }%` })
      !!dto.type && query.where('f_table.alias = :alias', { alias: dto.type })
      !!dto.field && !!dto.order && query.orderBy(`f_table.${ dto.field }`, dto.order) 
    return await paginate(query, { page: dto.page, pageSize: dto.pageSize })
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
}
