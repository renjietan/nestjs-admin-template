import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { IdParam } from '~/common/decorators/path-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { PagerDto } from '~/common/dto/pager.dto'
import { FTableEntity } from '~/entities/f-table'
import { CreateHzDtos, CreateTableDto } from './dto/create-hf.dto'
import { SearchHFDto } from './dto/search.dto'
import { UpdateTableDto } from './dto/update-hf.dto'
import { HopFreqService } from './hop-freq.service'

export const permissions = definePermission('confg:hopFreq', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Config - 调频表')
@ApiSecurityAuth()
@Controller('freq-table')
export class HopFreqController {
  constructor(
    private readonly f_table_seivce: HopFreqService,
    @InjectRepository(FTableEntity) private readonly f_table_entity: Repository<FTableEntity>,
  ) { }

  // @Patch()
  // @ApiOperation({
  //   summary: '批量新增: 初始化 80张表时, law_conf可传空',
  //   description: '查看最下方 CreateFreqTableDto 参数说明',
  // })
  // @ApiResult({ type: String })
  // @Perm(permissions.CREATE)
  // async init(@Body() createFreqTableDto: CreateFreqTableDto, @AuthUser() user: IAuthUser) {
  //   let {
  //     law_conf,
  //   } = createFreqTableDto
  //   const uId = user?.uid
  //   const isExsit = (law_conf?.length ?? 0) > 0
  //   // NOTE(2025-01-08 10:28:30 谭人杰): 如果为空，则按照默认配置来执行
  //   law_conf = (isExsit ? law_conf : default_hopping_conf).map((item, index) => {
  //     !item.order && (item.order = index)
  //     return item
  //   })
  //   const _hc = default_hopping_conf.reduce((cur, pre) => {
  //     const _pre = new BaseFreqTableDto()
  //     _pre.id = pre.id
  //     _pre.count = pre.count
  //     _pre.law_end = pre.law_end
  //     _pre.law_spacing = pre.law_spacing
  //     _pre.law_start = pre.law_start
  //     _pre.point_count = pre.point_count
  //     _pre.type = pre.type
  //     cur[pre.type] = _pre
  //     return cur
  //   }, {})
  //   law_conf = law_conf.reduce((cur, pre, index) => {
  //     const hc_obj = _hc[pre.type]
  //     pre.id = hc_obj.id
  //     pre.point_count = pre.point_count ? pre.point_count : hc_obj.point_count
  //     pre.law_end = pre.law_end ? pre.law_end : hc_obj.law_end
  //     pre.count = pre.count ? pre.count : hc_obj.count
  //     pre.law_start = pre.law_start ? pre.law_start : hc_obj.law_start
  //     if (!pre.law_spacing) {
  //       pre.law_spacing = b_diff(pre.law_start, pre.law_end, pre.point_count, hc_obj.law_spacing)
  //     }
  //     cur.push(pre)
  //     return cur
  //   }, [])
  //   const data = law_conf.sort((a, b) => a.id - b.id).map((item, index) => {
  //     const { law_end, law_spacing, law_start, type, count, point_count } = item
  //     const arr = Array.from({ length: count }).map((e, i) => {
  //       const obj = {
  //         law_end,
  //         law_spacing,
  //         law_start,
  //         type,
  //         createById: uId,
  //         point_count,
  //         order: index + i + 1
  //       }
  //       return { ...obj }
  //     })
  //     return arr
  //   }).flat()
  //   const all_data = await this.f_table_entity.find()
  //   const total_len = data.length + all_data.length
  //   if (total_len > 80) {
  //     throw new BusinessException(ErrorEnum.DataLimitExceeded)
  //   }
  //   try {
  //     const res = await this.f_table_entity.manager.transaction(async (manager) => {
  //       for (const item of data) {
  //         await this.f_table_seivce.create_table({
  //           type: item.type,
  //           alias: `Table No.${item.order}`,
  //           point_count: item.point_count,
  //           law_start: item.law_start,
  //           law_spacing: item.law_spacing,
  //           law_end: item.law_end,
  //           order: item.order
  //         }, uId)
  //       }
  //     })
  //     return res
  //   }
  //   catch (error) {
  //     throw new BusinessException(ErrorEnum.OperationFailed)
  //   }
  // }

  @Get()
  @ApiOperation({ summary: '列表',description: '跳频表'})
  @ApiResult({ type: [FTableEntity] })
  @Perm(permissions.LIST)
  async page(@Query() dto: SearchHFDto) {
    return this.f_table_seivce.page(dto)
  }

  @Get("hoppings/:f_table_id")
  @ApiOperation({ summary: '列表',description: '频点表'})
  @ApiResult({ type: [FTableEntity] })
  @Perm(permissions.LIST)
  async pageByTableId(@Param("f_table_id") table_id: string, @Query() dto: PagerDto) {
    return this.f_table_seivce.pageByTableId(table_id, dto)
  }


  @Post("create_hf")
  @ApiOperation({ summary: '新增',description: '跳频表'})
  @ApiResult({ type: CreateTableDto })
  @Perm(permissions.CREATE)
  async create_hf(@Body() dto: CreateTableDto, @AuthUser() user: IAuthUser) {
    return this.f_table_seivce.create_hF(dto, user?.uid)
  }

  @Put("update_hf/:id")
  @ApiOperation({
    summary: '更新',
    description: '跳频表: 所有参数非必传',
  })
  @ApiResult({ type: String })
  @Perm(permissions.UPDATE)
  async update_hf(@IdParam() id: string, @Body() dto: UpdateTableDto, @AuthUser() user: IAuthUser) {
    return this.f_table_seivce.update_hf(+id, dto, user?.uid)
  }

  @Delete("delete_hf/:id")
  @ApiOperation({
    summary: '删除',
    description: '跳频表',
  })
  @ApiResult({ type: String })
  @Perm(permissions.DELETE)
  async delete_hf(@IdParam() id: string) {
    return this.f_table_seivce.delete_hf(+id)
  }

  @Patch("create_hz/:table_id")
  @ApiOperation({
    summary: '批量新增',
    description: `频点表: 
      allow-clean = 1  代表插入数据前,是否需要根据[tableId]删除调频表的数据
    `,
  })
  @ApiResult({ type: String })
  @Perm(permissions.CREATE)
  async create_hz(@Param("table_id") table_id: string, @Body() dto: CreateHzDtos, @AuthUser() user: IAuthUser) {
    return this.f_table_seivce.create_hz(+table_id, dto, user?.uid)
  }
}
