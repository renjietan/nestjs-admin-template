import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DictItemEntity } from "./../../../entities/dict-item.entity";

import { Repository } from "typeorm";

import { Exact } from "~/common/dto/pager.dto";
import { DictTypeEntity } from "~/entities/dict-type.entity";

import { paginate } from "~/helper/paginate";
import { createPaginationObject } from "~/helper/paginate/create-pagination";
import { Pagination } from "~/helper/paginate/pagination";
import { DictItemService } from "../dict-item/dict-item.service";
import { PatchDto } from "./dict-patch.dto";
import { DictTypeDto, DictTypeQueryDto } from "./dict-type.dto";

@Injectable()
export class DictTypeService {
  constructor(
    @InjectRepository(DictTypeEntity) private dictTypeRepository: Repository<DictTypeEntity>,
    @InjectRepository(DictItemEntity) private dictItemRepository: Repository<DictItemEntity>,
    private readonly dict_service: DictItemService,

  ) {}

  async patch(dto: PatchDto) {
    let { allow_clean, dicts } = dto;
    return await this.dictTypeRepository.manager.transaction(async (manager) => {
      try {
        if (allow_clean == Exact.TRUE) {
          await manager.clear(DictTypeEntity);
          await manager.clear(DictItemEntity);
        } else {
          let query = dicts.reduce(
            (cur, pre) => {
              const types = [
                { code: pre.code },
                { name: pre.name },
                { en_name: pre.en_name },
              ];
              const items = pre.items.reduce((_cur, _pre) => {
                let temp = [
                  { value: _pre.value },
                  { label: _pre.label },
                  { en_label: _pre.en_label },
                ];
                return [..._cur, ...temp];
              }, []);
              cur.types = [...cur.types, ...types];
              cur.items = [...cur.items, ...items];
              return cur;
            },
            {
              types: [],
              items: [],
            }
          );
          let entity_type = await manager.findOne(DictTypeEntity, {
            where: query.types,
          });
          let entity_item = await manager.findOne(DictItemEntity, {
            where: query.items,
          });
          console.log(entity_type);
          console.log(entity_item);
        }
        const res = [];
        for (const e of dicts) {
          const insert_type_obj = {
            name: e.name,
            code: e.code,
            en_name: e.en_name,
            status: e?.status || 1,
            remark: e?.remark || "",
            createBy: e?.createBy || 1,
            items: [],
          };
          let insert_entity = await manager.save(
            DictTypeEntity,
            insert_type_obj
          );
          console.log("insert_entity", insert_entity);
          let items = e?.items ?? [];
          // for (const element of items) {
          //   items = items.map((item, index) => ({
          //     label: item.label,
          //     value: item.value,
          //     en_label: item.en_label,
          //     status: e?.status || 1,
          //     remark: e?.remark || "",
          //     createBy: e?.createBy || 1,
          //     type: insert_entity,
          //     orderNo: index + 1,
          //   }));
          //   let insert_item_entity = await manager.save(DictItemEntity, items);
          //   insert_type_obj.items.push(insert_item_entity);
          // }
          items = items.map((item, index) => ({
            label: item.label,
            value: item.value,
            en_label: item.en_label,
            status: item?.status || 1,
            remark: item?.remark || "",
            createBy: item?.createBy || 1,
            type: insert_entity,
            orderNo: index + 1,
          }));
          let insert_item_entity = await manager.insert(DictItemEntity, items);
          insert_type_obj.items.push(insert_item_entity);
          res.push(insert_type_obj);
        }
        return res;
      } catch (error) {
        console.log("error==============", error);
      }
    });
  }

  async full() {
    const entities = await this.dict_service.page({});
    const items = entities.items.reduce((cur, pre) => {
      const type_id = pre?.type?.id;
      !cur[type_id] && (cur[type_id] = { ...pre.type, children: [] });
      delete pre.type;
      cur[type_id].children.push(pre);
      return cur;
    }, {});
    const _items = Object.values(items);
    return createPaginationObject({
      items: _items,
      totalItems: _items.length,
      currentPage: 1,
      limit: _items.length,
    });
  }

  /**
   * 罗列所有配置
   */
  async page({
    page,
    pageSize,
    name,
    code,
  }: DictTypeQueryDto): Promise<Pagination<DictTypeEntity>> {
    const queryBuilder = this.dictTypeRepository
      .createQueryBuilder("dict_type")
      .where({
        ...(name && { name }),
        ...(code && { code }),
      });

    return paginate(queryBuilder, { page, pageSize });
  }

  /** 一次性获取所有的字典类型 */
  async getAll() {
    return this.dictTypeRepository.find();
  }

  /**
   * 获取参数总数
   */
  async countConfigList(): Promise<number> {
    return this.dictTypeRepository.count();
  }

  /**
   * 新增
   */
  async create(dto: DictTypeDto): Promise<void> {
    await this.dictTypeRepository.insert(dto);
  }

  /**
   * 更新
   */
  async update(id: number, dto: Partial<DictTypeDto>): Promise<void> {
    await this.dictTypeRepository.update(id, dto);
  }

  /**
   * 删除
   */
  async delete(id: number): Promise<void> {
    await this.dictTypeRepository.delete(id);
  }

  /**
   * 查询单个
   */
  async findOne(id: number): Promise<DictTypeEntity> {
    return this.dictTypeRepository.findOneBy({ id });
  }
}
