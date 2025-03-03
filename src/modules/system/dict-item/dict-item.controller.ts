import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { IdParam } from '~/common/decorators/path-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { DictItemEntity } from '~/entities/dict-item.entity'
import { Pagination } from '~/helper/paginate/pagination'

import { DictItemDto, DictItemQueryDto } from './dict-item.dto'
import { DictItemService } from './dict-item.service'

export const permissions = definePermission('system:dict-item', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('System - 字典项模块')
@ApiSecurityAuth()
@Controller('dict-item')
export class DictItemController {
  constructor(private dictItemService: DictItemService) {}

  @Get()
  @ApiOperation({ summary: '获取字典项列表' })
  @ApiResult({ type: [DictItemEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: DictItemQueryDto): Promise<Pagination<DictItemEntity>> {
    return this.dictItemService.page(dto)
  }

  @Post()
  @ApiOperation({ summary: '新增字典项' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: DictItemDto, @AuthUser() user: IAuthUser): Promise<void> {
    await this.dictItemService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询字典项信息' })
  @ApiResult({ type: DictItemEntity })
  @Perm(permissions.READ)
  async info(@IdParam() id: number): Promise<DictItemEntity> {
    return this.dictItemService.findOne(id)
  }

  @Get('byCode/:code')
  @ApiOperation({ summary: '根据code查询字典项信息' })
  @ApiResult({ type: DictItemEntity })
  @Perm(permissions.READ)
  async infoByCode(@Param("code") code: string): Promise<DictItemEntity> {
    return this.dictItemService.findOneByCode(code)
  }

  @Post(':id')
  @ApiOperation({ summary: '更新字典项' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body(UpdaterPipe) dto: DictItemDto): Promise<void> {
    await this.dictItemService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除指定的字典项' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    await this.dictItemService.delete(id)
  }
}
