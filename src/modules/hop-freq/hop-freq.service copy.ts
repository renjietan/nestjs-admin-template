// import { Injectable } from '@nestjs/common';
// import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Not, Repository } from 'typeorm';
// import { FHoppingEntity } from '~/entities/f-hopping';
// import { FTableEntity } from '~/entities/f-table';
// import { BaseTableDto } from './dto/base_table';
// import { BaseFreqTableDto } from './dto/base-freq-table.dto';
// import { BusinessException } from '~/common/exceptions/biz.exception';
// import { default_hopping_conf } from '~/utils/init.mock.data';
// import { b_diff } from '~/utils';
// import { IdsDto } from '~/common/dto/ids.dto';
// import { CreateFreqHopDto } from './freq_dto/create-freq-hop.dto';
// import { CoverFreqHopDto } from './freq_dto/cover-freq-hop.dto';
// import { UpdateFreqHopBaseDto, UpdateFreqHopDto } from './freq_dto/update-freq-hop.dto';
// import { ResetFreqHopDto } from './freq_dto/reset-freq-hop.dto';
// import { GFreqHopDto } from './freq_dto/g-freq-hop.dto';

// @Injectable()
// export class HopFreqService {
//     constructor(
//         @InjectRepository(FTableEntity) private readonly f_table_entity: Repository<FTableEntity>,
//         @InjectRepository(FHoppingEntity) private readonly f_hopping_entity: Repository<FHoppingEntity>,
//         @InjectDataSource() private dataSource: DataSource
//       ) { }
    
//       async create(alias: string, createById: number, data: BaseFreqTableDto) {
//         const temp = new FTableEntity()
//         temp.alias = alias
//         temp.createBy = createById
//         temp.law_end = data.law_end
//         temp.law_spaceing = data.law_spacing
//         temp.law_start = data.law_start
//         temp.type = data.type
//         return await this.f_table_entity.save(temp)
//       }
    
//       async create_table(data: BaseTableDto, uId: number) {
//         let exist_data = await this.f_table_entity.find()
//         if(exist_data.length > 80) {
//           throw new BusinessException('500:The number of data must not exceed 80')
//         }
//         const _temp = default_hopping_conf.find(item => item.type == data.type)
//         const isExist = await this.f_table_entity.findOne({
//           where: {
//             alias: data.alias,
//           },
//         })
//         if (isExist) {
//           throw new BusinessException('500:alias is exist')
//         }
//         const db = new FTableEntity()
//         if (!_temp) {
//           throw new BusinessException('500:table type does not exist')
//         }
//         data.point_count = data.point_count ? data.point_count : _temp.point_count
//         data.law_end = data.law_end ? data.law_end : _temp.law_end
//         data.law_start = data.law_start ? data.law_start : _temp.law_start
//         if (!data.law_spacing) {
//           let _law_spacing = b_diff(data.law_start, data.law_end, data.point_count, _temp.law_spacing)
//           data.law_spacing = _law_spacing < _temp.law_spacing ? _temp.law_spacing : _law_spacing
//         }
//         db.alias = data.alias
//         db.createBy = uId
//         db.law_end = data.law_end
//         db.law_spaceing = data.law_spacing
//         db.law_start = data.law_start
//         db.type = data.type
//         const table = await this.f_table_entity.save(db)
//         const points = Array.from({
//           length: data.point_count,
//         }).map((item, index) => {
//           const value = data.law_start + index * data.law_spacing
//           return value > data.law_end ? data.law_end : value
//         })
//         for (let index = 0; index < points.length; index++) {
//           await this.create_freq({
//             createById: uId,
//             f_table_id: table.id,
//             value: points[index],
//           })
//         }
//       }
    
//       async findAll() {
//         // const results = await this.dataSource.query(
//         //     `
//         //       SELECT f_table.*, COUNT(f_hopping.id) AS point_count
//         //       FROM f_table
//         //       LEFT JOIN f_hopping ON f_table.id = f_hopping.f_table_id
//         //       GROUP BY f_table.id;
//         //     `
//         // );
//         // return results;
//         return await this.f_table_entity.find()
//       }
    
//       async findByTableType(type: string) {
//         let results = await this.dataSource.query(
//             `
//                SELECT f_table.*, f_hopping.id as h_id, f_hopping.value as h_value  FROM f_hopping
//                 LEFT JOIN f_table ON f_table.id = f_hopping.f_table_id 
//                 WHERE f_table.type = '${ type }'
//             `
//         );
        
//         results = results.reduce((cur, pre) => {
//           let point = {
//             id: pre.h_id,
//             value: pre.h_value
//           }
//           if(!cur[pre.id]) {
//             cur[pre.id] = {
//               id: pre.id,
//               alias: pre.alias,
//               type: pre.type,
//               law_start: pre.law_start,
//               law_spaceing: pre.law_spaceing,
//               law_end: pre.law_end,
//               createById: pre.createById,
//               createTime: pre.createTime,
//               updateTime: pre.updateTime,
//               points: []
//             }
//           }
    
//           cur[pre.id].points.push(point)
//           return cur
//         }, {})
//         return results;
//       }
    
//       async batch_remove_table(data: IdsDto) {
//         for (const id of data.ids) {
//           await this.remove(id)
//         }
//         return "success"
//       }
    
//       async update(id: number, alias: string) {
//         const isExist = await this.f_table_entity.findOne({
//           where: {
//             alias,
//             id: Not(id),
//           },
//         })
//         if (isExist) {
//           throw new BusinessException('500:alias is exist')
//         }
//         return await this.f_table_entity.createQueryBuilder().update(FTableEntity).set({
//           alias,
//         }).where({
//           id,
//         }).execute()
//       }
    
//       async remove(id: number) {
//         return await this.f_table_entity.manager.transaction(async (manager) => {
//           await manager.delete(FHoppingEntity, {
//             f_table_id: id,
//           })
//           return await manager.delete(FTableEntity, id)
//         })
//       }
    
//       async create_freq(freqhop_dto: CreateFreqHopDto) {
//         const db = new FHoppingEntity()
//         db.createBy = freqhop_dto.createById
//         db.f_table_id = freqhop_dto.f_table_id
//         db.value = freqhop_dto.value
//         return await this.f_hopping_entity.save(db)
//       }
    
//       async batch_remove_freq(params: IdsDto) {
//         return await this.f_hopping_entity.manager.transaction(async manager => {
//           return await manager.delete(FHoppingEntity, params.ids)
//         })
//       }
      
//       async cover_freq(data: CoverFreqHopDto) {
//         const { createById, f_table_id } = data
//         const _temp = default_hopping_conf.find(item => item.type == data.type)
//         if (!_temp) {
//           throw new BusinessException('500:table type does not exist')
//         }
//         await this.f_hopping_entity.delete({
//           f_table_id,
//         })
//         await this.f_table_entity.createQueryBuilder().update(FTableEntity).set({
//           type: data.type,
//           law_start: data.law_start,
//           law_spaceing: data.law_spacing,
//           law_end: data.law_end,
//           createBy: data.createById,
//         }).where({
//           id: f_table_id,
//         }).execute()
//         let _values = data.values.split(',')
//         for (const item of _values) {
//           const db = new FHoppingEntity()
//           db.createBy = createById
//           db.f_table_id = f_table_id
//           db.value = Number(item)
//           await this.f_hopping_entity.save(db)
//         }
//         // const promises = data.values.split(',').map((item) => {
//         //   return 
//         // })
//         // return await Promise.all(promises)
//         return 'success'
//       }
    
//       async findHopByTableId(f_table_id: number) {
//         let res = await this.f_hopping_entity.find({
//           where: {
//             f_table_id,
//           },
//         })
//         return res
//       }
    
//       async update_hop(freqhop_dto: UpdateFreqHopDto) {
//         const promises = freqhop_dto.data.map((item) => {
//           return this.f_hopping_entity.createQueryBuilder().update(FHoppingEntity).set({
//             value: item.value,
//           }).where({
//             id: item.id,
//           }).execute()
//         })
//         return await Promise.all(promises)
//       }
    
//       async resetHopByIds(data: ResetFreqHopDto) {
//         const { ids } = data
//         const _ids = ids.split(',').sort((a: string, b: string) => Number(a) - Number(b))
    
//         const _temp = default_hopping_conf.find(item => item.type == data.type)
//         if (!_temp) {
//           throw new BusinessException('500:table type does not exist')
//         }
//         const point_count = _ids.length
//         data.law_end = data.law_end ? data.law_end : _temp.law_end
//         data.law_start = data.law_start ? data.law_start : _temp.law_start
//         if (!data.law_spacing) {
//           let _law_spacing = b_diff(data.law_start, data.law_end, point_count, _temp.law_spacing)
//           data.law_spacing = _law_spacing < _temp.law_spacing ? _temp.law_spacing : _law_spacing
//         }
//         const points = _ids.map((item, index) => {
//           const value = data.law_start + index * data.law_spacing
//           const temp = new UpdateFreqHopBaseDto()
//           temp.id = Number(item)
//           temp.value = value > data.law_end ? data.law_end : value
//           return temp
//         })
//         return await this.update_hop({ data: points })
//       }
    
//       g_random_freq(data: GFreqHopDto) {
//         const _temp = default_hopping_conf.find(item => item.type == data.type)
//         if (!_temp) {
//           throw new BusinessException('500:table type does not exist')
//         }
//         data.point_count = data.point_count ? data.point_count : _temp.point_count
//         data.law_end = data.law_end ? data.law_end : _temp.law_end
//         data.law_start = data.law_start ? data.law_start : _temp.law_start
//         if (!data.law_spacing) {
//           let _law_spacing = b_diff(data.law_start, data.law_end, data.point_count, _temp.law_spacing)
//           data.law_spacing = _law_spacing < _temp.law_spacing ? _temp.law_spacing : _law_spacing
//         }
//         return Array.from({ length: data.point_count }).map((item, index) => {
//           const value = data.law_start + index * data.law_spacing
//           return value > data.law_end ? data.law_end : value
//         })
//       }
// }
