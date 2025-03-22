import { Body, Controller, Delete, Get, Patch, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { IdParam } from '~/common/decorators/path-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { DictTypeEntity } from '~/entities/dict-type.entity'

import { Exact } from '~/common/dto/pager.dto'
import { Pagination } from '~/helper/paginate/pagination'
import { PatchDto } from './dict-patch.dto'
import { DictTypeDto, DictTypeQueryDto } from './dict-type.dto'
import { DictTypeService } from './dict-type.service'

export const permissions = definePermission('system:dict-type', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('System - 字典类型模块')
@ApiSecurityAuth()
@Controller('dict-type')
export class DictTypeController {
  constructor(private dictTypeService: DictTypeService) {}

  @Patch()
  @ApiOperation({ summary: '批量 新增 | 初始化' })
  @ApiResult({ type: [DictTypeEntity], isPage: true })
  @Perm(permissions.CREATE)
  async patch(@Body() dto: PatchDto): Promise<any> {
    dto.allow_clean = dto?.allow_clean ?? Exact.TRUE
    return this.dictTypeService.patch(dto)
  }

  @Get('full')
  @ApiOperation({ summary: '获取所有字典（字典类型 + 字典）' })
  @ApiResult({ type: [DictTypeEntity], isPage: true })
  @Perm(permissions.LIST)
  async full(): Promise<any> {
    return this.dictTypeService.full()
  }

  @Get()
  @ApiOperation({ summary: '获取字典类型列表' })
  @ApiResult({ type: [DictTypeEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: DictTypeQueryDto): Promise<Pagination<DictTypeEntity>> {
    return this.dictTypeService.page(dto)
  }

  @Get('select-options')
  @ApiOperation({ summary: '一次性获取所有的字典类型(不分页)' })
  @ApiResult({ type: [DictTypeEntity] })
  @Perm(permissions.LIST)
  async getAll(): Promise<DictTypeEntity[]> {
    return this.dictTypeService.getAll()
  }

  @Post()
  @ApiOperation({ summary: '新增字典类型' })
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) dto: DictTypeDto): Promise<void> {
    await this.dictTypeService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询字典类型信息' })
  @ApiResult({ type: DictTypeEntity })
  @Perm(permissions.READ)
  async info(@IdParam() id: number): Promise<DictTypeEntity> {
    return this.dictTypeService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新字典类型' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body(UpdaterPipe) dto: DictTypeDto): Promise<void> {
    await this.dictTypeService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除指定的字典类型' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    await this.dictTypeService.delete(id)
  }
}
