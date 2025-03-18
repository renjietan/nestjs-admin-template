import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { IdsDto } from '~/common/dto/ids.dto'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { FHoppingEntity } from '~/entities/f-hopping'
import { FTableEntity } from '~/entities/f-table'
import { default_hopping_conf } from '~/utils/init.mock.data'
import { b_diff } from '~/utils/tool.util'
import { BaseFreqTableDto } from './dto/base-freq-table.dto'
import { BaseTableDto } from './dto/base_table'
import { CreateFreqTableDto } from './dto/create-freq-table.dto'
import { CoverFreqHopDto } from './freq_dto/cover-freq-hop.dto'
import { CreateFreqHopDto } from './freq_dto/create-freq-hop.dto'
import { GFreqHopDto } from './freq_dto/g-freq-hop.dto'
import { ResetFreqHopDto } from './freq_dto/reset-freq-hop.dto'
import { UpdateFreqHopDto } from './freq_dto/update-freq-hop.dto'
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

  @Patch()
  @ApiOperation({
    summary: '批量新增: 初始化 80张表时, law_conf可传空',
    description: '查看最下方 CreateFreqTableDto 参数说明',
  })
  @ApiResult({ type: String })
  @Perm(permissions.CREATE)
  async init(@Body() createFreqTableDto: CreateFreqTableDto, @AuthUser() user: IAuthUser) {
    let {
      law_conf,
    } = createFreqTableDto
    const uId = user?.uid
    const isExsit = (law_conf?.length ?? 0) > 0
    // NOTE(2025-01-08 10:28:30 谭人杰): 如果为空，则按照默认配置来执行
    law_conf = isExsit ? law_conf : default_hopping_conf
    const _hc: {
      [key: string]: BaseFreqTableDto
    } = default_hopping_conf.reduce((cur, pre) => {
      const _pre = new BaseFreqTableDto()
      _pre.id = pre.id
      _pre.count = pre.count
      _pre.law_end = pre.law_end
      _pre.law_spacing = pre.law_spacing
      _pre.law_start = pre.law_start
      _pre.point_count = pre.point_count
      _pre.type = pre.type
      cur[pre.type] = _pre
      return cur
    }, {})
    law_conf = law_conf.reduce((cur, pre, index) => {
      const hc_obj = _hc[pre.type]
      pre.id = hc_obj.id
      pre.point_count = pre.point_count ? pre.point_count : hc_obj.point_count
      pre.law_end = pre.law_end ? pre.law_end : hc_obj.law_end
      pre.count = pre.count ? pre.count : hc_obj.count
      pre.law_start = pre.law_start ? pre.law_start : hc_obj.law_start
      if (!pre.law_spacing) {
        pre.law_spacing = b_diff(pre.law_start, pre.law_end, pre.point_count, hc_obj.law_spacing)
      }
      cur.push(pre)
      return cur
    }, [])
    const data = law_conf.sort((a, b) => a.id - b.id).map((item, index) => {
      const { law_end, law_spacing, law_start, type, count, point_count } = item
      const arr = Array.from({ length: count }).map((e, i) => {
        const obj = {
          law_end,
          law_spacing,
          law_start,
          type,
          createById: uId,
          point_count,
        }
        return { ...obj }
      })
      return arr
    }).flat()
    const all_data = await this.f_table_entity.find()
    const total_len = data.length + all_data.length
    if (total_len > 80) {
      throw new BusinessException('500:The number of data must not exceed 80')
    }

    try {
      const res = await this.f_table_entity.manager.transaction(async (manager) => {
        let index = 1
        for (const item of data) {
          await this.f_table_seivce.create_table({
            type: item.type,
            alias: `Table No.${index}`,
            point_count: item.point_count,
            law_start: item.law_start,
            law_spacing: item.law_spacing,
            law_end: item.law_end,
          }, uId)
          index++
        }
      })
      return res
    }
    catch (error) {
      throw new BusinessException(`500:${error}`)
    }
  }

  @Post('create_table')
  @ApiOperation({
    summary: '新增表以及随机生成频率值',
    description: '查看最下方 BaseTableDto 参数说明',
  })
  @ApiResult({ type: FTableEntity })
  @Perm(permissions.CREATE)
  async create_table(@Body() data: BaseTableDto, @AuthUser() user: IAuthUser) {
    return await this.f_table_seivce.create_table(data, user?.uid)
  }

  @ApiOperation({
    summary: '更新表-别名: 名称不可重复',
  })
  @Put('update/:id/:alias')
  @ApiResult({ type: UpdateResult })
  @Perm(permissions.UPDATE)
  async update(@Param('id') id: string, @Param('alias') alias: string) {
    return await this.f_table_seivce.update(+id, alias)
  }

  @ApiOperation({
    summary: '删除调频表  且 删除频点, 传0 删除所有',
  })
  @Delete('del/:id')
  @ApiResult({ type: String })
  @Perm(permissions.DELETE)
  remove(@Param('id') id: string) {
    return this.f_table_seivce.remove(+id)
  }

  @ApiOperation({
    summary: '调频表: 只查询调频表， 不查询频点，数据量太大',
  })
  @Get('list')
  @ApiResult({ type: [FTableEntity] })
  @Perm(permissions.LIST)
  async findAll() {
    return await this.f_table_seivce.findAll()
  }

  @ApiOperation({
    summary: '根据调频表类型 查询表以及频点',
  })
  @Get('findByType/:type')
  @ApiResult({ type: [FTableEntity] })
  @Perm(permissions.LIST)
  async findByType(@Param('type') type: string) {
    return await this.f_table_seivce.findByTableType(type)
  }

  @ApiOperation({
    summary: '批量删除表以及频点',
  })
  @Delete('batch_remove_table')
  @ApiResult({ type: String })
  @Perm(permissions.DELETE)
  async batch_remove_table(@Body() data: IdsDto) {
    return await this.f_table_seivce.batch_remove_table(data)
  }

  @ApiOperation({
    summary: '根据表ID获取 这个表所有频点',
  })
  @Get(':f_table_id')
  @ApiResult({ type: [FHoppingEntity] })
  @Perm(permissions.LIST)
  findHopByTableId(@Param('f_table_id') f_table_id: string) {
    return this.f_table_seivce.findHopByTableId(+f_table_id)
  }

  @ApiOperation({
    summary: '根据调频表ID 新增频点',
  })
  @Post('create_hop')
  @Perm(permissions.CREATE)
  createFreq(@Body() freqhop_dto: CreateFreqHopDto, @AuthUser() user: IAuthUser) {
    return this.f_table_seivce.create_freq(user?.uid, freqhop_dto)
  }

  @ApiOperation({
    summary: '批量删除频点',
  })
  @Delete('batch_remove_hop')
  @ApiResult({ type: String })
  @Perm(permissions.DELETE)
  batchRemoveFreq(@Body() ids: IdsDto) {
    return this.f_table_seivce.batch_remove_freq(ids)
  }

  @ApiOperation({
    summary: '根据ID 批量更新频点',
  })
  @Put('update_hop')
  @ApiResult({ type: [UpdateResult] })
  @Perm(permissions.UPDATE)
  updateHop(@Body() updateFreqDto: UpdateFreqHopDto) {
    return this.f_table_seivce.update_hop(updateFreqDto)
  }

  @ApiOperation({
    summary: '重置频点: 传入的type值, 不要做修改; 此处type值 用于 计算law_spacing',
  })
  @Put('reset')
  @ApiResult({ type: [UpdateResult] })
  @Perm(permissions.UPDATE)
  resetHopByIds(@Body() resetFreqHopDto: ResetFreqHopDto) {
    return this.f_table_seivce.resetHopByIds(resetFreqHopDto)
  }

  @ApiOperation({
    summary: '生成频点随机数据，不存库',
  })
  @Post('g_random_freq')
  @ApiResult({ type: [Object], isPage: true })
  @Perm(permissions.LIST)
  g_random_freq(@Body() data: GFreqHopDto) {
    return this.f_table_seivce.g_random_freq(data)
  }

  @ApiOperation({
    summary: '根据跳频表  覆盖频点数据',
  })
  @Put('cover_freq')
  @ApiResult({ type: String })
  @Perm(permissions.UPDATE)
  cover_freq(@Body() data: CoverFreqHopDto, @AuthUser() user: IAuthUser) {
    const uId = user?.uid
    return this.f_table_seivce.cover_freq(uId, data)
  }
}
