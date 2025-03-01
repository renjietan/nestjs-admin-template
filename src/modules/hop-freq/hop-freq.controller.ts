import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HopFreqService } from './hop-freq.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoverFreqHopDto } from './freq_dto/cover-freq-hop.dto';
import { GFreqHopDto } from './freq_dto/g-freq-hop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FTableEntity } from '~/entities/f-table';
import { Repository } from 'typeorm';
import { CreateFreqTableDto } from './dto/create-freq-table.dto';
import { default_hopping_conf } from '~/utils/init.mock.data';
import { BaseFreqTableDto } from './dto/base-freq-table.dto';
import { b_diff } from '~/utils/tool.util';
import { BaseTableDto } from './dto/base_table';
import { IdsDto } from '~/common/dto/ids.dto';
import { CreateFreqHopDto } from './freq_dto/create-freq-hop.dto';
import { UpdateFreqHopDto } from './freq_dto/update-freq-hop.dto';
import { ResetFreqHopDto } from './freq_dto/reset-freq-hop.dto';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator';
import { Public } from '~/common/decorators/auth/public.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { ErrorEnum } from '~/constants/error-code.constant';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator';
import { instanceToPlain, plainToClass, plainToInstance } from 'class-transformer';

export const permissions = definePermission('confg:hopFreq', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Config - 调频表')
@ApiSecurityAuth()
@Controller('hop-freq')

export class HopFreqController {
  constructor(
    private readonly f_table_seivce: HopFreqService,
    @InjectRepository(FTableEntity) private readonly f_table_entity: Repository<FTableEntity>,
  ) { }


  @Post()
  @ApiOperation({
    summary: '批量新增: 初始化 80张表时, law_conf可传空',
    description: '查看最下方 CreateFreqTableDto 参数说明',
  })
  @ApiResult({ type: String })
  @Perm(permissions.CREATE)
  async create(@Query() createFreqTableDto: CreateFreqTableDto, @AuthUser() user: IAuthUser,) {
    let {
      law_conf,
    } = createFreqTableDto
    console.log('data====================', instanceToPlain(createFreqTableDto));
    let createById = user?.uid
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
      try {
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
      } catch (error) {
      }
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
          createById,
        }
        const points = Array.from({
          length: point_count,
        }).map((item, index) => {
          const value = law_start + index * law_spacing
          return value > law_end ? law_end : value
        })
        return { ...obj, points }
      })
      return arr
    }).flat()
    try {
      let res = await this.f_table_entity.manager.transaction(async (manager) => {
        data.forEach(async (item, index) => {
          const t_res = await this.f_table_seivce.create(`Table No.${index}`, createById, {
            law_end: item.law_end,
            law_start: item.law_start,
            law_spacing: item.law_spacing,
            type: item.type,
          })
          item.points.forEach(async (c) => {
            await this.f_table_seivce.create_freq({
              createById,
              value: c,
              f_table_id: t_res.id,
            })
          })
        })
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
  async create_table(@Body() data: BaseTableDto, @AuthUser() user: IAuthUser) {
    return await this.f_table_seivce.create_table(data, user.uid)
  }

  @ApiOperation({
    summary: '更新: 名称不可重复',
  })
  @Post('update/:id/:alias')
  async update(@Param('id') id: string, @Param('alias') alias: string) {
    return await this.f_table_seivce.update(+id, alias)
  }

  @ApiOperation({
    summary: '删除调频表  且 删除频点',
  })
  @Post('del/:id')
  remove(@Param('id') id: string) {
    return this.f_table_seivce.remove(+id)
  }

  @ApiOperation({
    summary: '调频表: 只查询调频表， 不查询频点，数据量太大',
  })
  @Get('list')
  async findAll() {
    return await this.f_table_seivce.findAll()
  }

  @ApiOperation({
    summary: '根据调频表类型 查询表以及频点',
  })
  @Get('findByType/:type')
  async findByType(@Param('type') type: string) {
    return await this.f_table_seivce.findByTableType(type)
  }

  @ApiOperation({
    summary: '批量删除表以及频点',
  })
  @Post('batch_remove_table')
  async batch_remove_table(@Body() data: IdsDto) {
    return await this.f_table_seivce.batch_remove_table(data)
  }



  @ApiOperation({
    summary: '根据表ID获取 这个表所有频点',
  })
  @Get(':f_table_id')
  findHopByTableId(@Param('f_table_id') f_table_id: string) {
    return this.f_table_seivce.findHopByTableId(+f_table_id)
  }

  @ApiOperation({
    summary: '根据调频表ID 新增频点',
  })
  @Post('create_hop')
  createFreq(@Body() freqhop_dto: CreateFreqHopDto) {
    return this.f_table_seivce.create_freq(freqhop_dto)
  }

  @ApiOperation({
    summary: '批量删除频点',
  })
  @Post('batch_remove_hop')
  batchRemoveFreq(@Body() ids: IdsDto) {
    return this.f_table_seivce.batch_remove_freq(ids)
  }


  @ApiOperation({
    summary: '根据ID 批量更新频点',
  })
  @Post('update_hop')
  updateHop(@Body() updateFreqDto: UpdateFreqHopDto) {
    return this.f_table_seivce.update_hop(updateFreqDto)
  }

  @ApiOperation({
    summary: '重置频点: 传入的type值, 不要做修改; 此处type值 用于 计算law_spacing',
  })
  @Post('reset')
  resetHopByIds(@Body() resetFreqHopDto: ResetFreqHopDto) {
    return this.f_table_seivce.resetHopByIds(resetFreqHopDto)
  }

  @ApiOperation({
    summary: '生成频点随机数据，不存库',
  })
  @Post('g_random_freq')
  g_random_freq(@Body() data: GFreqHopDto) {
    return this.f_table_seivce.g_random_freq(data)
  }

  @ApiOperation({
    summary: '根据跳频表  覆盖频点数据',
  })
  @Post('cover_freq')
  cover_freq(@Body() data: CoverFreqHopDto) {
    return this.f_table_seivce.cover_freq(data)
  }
}
