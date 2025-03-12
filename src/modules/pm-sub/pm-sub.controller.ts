import { Body, Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PmSubService } from './pm-sub.service'
import { PMSubDto } from './dto/pm-sub.dto'
import { BasePMSubDto } from './dto/base-pm-sub.dto'
import { BatchPmSubDto } from './dto/batch-pm-sub.dto'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { IdsDto } from '~/common/dto/ids.dto'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { DeleteResult } from 'typeorm'
import { PMSubEntity } from '~/entities/pm_sub'

export const permissions = definePermission('pm:sub', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Task - 子任务')
@Controller('pm-sub')
export class PmSubController {
  constructor(
    private readonly pmSubService: PmSubService,
  ) {}

  @ApiOperation({
    summary: '列表',
  })
  @Get()
  @Perm(permissions.LIST)
  @ApiResult({ type: [PMSubEntity] })
  async search() {
    return await this.pmSubService.search()
  }

  @ApiOperation({
    summary: '批量新增: 传pm_sub_id则视为更新,不传则视为新增',
  })
  @Post()
  @Perm(permissions.CREATE)
  @ApiResult({ type: PMSubEntity })
  async create(@Body() data: PMSubDto, @AuthUser() user: IAuthUser) {
    return await this.pmSubService.create(data, user?.uid)
  }

  @ApiOperation({
    summary: '批量新增:传pm_sub_id则视为更新,不传则视为新增',
  })
  @Patch('batchCreate')
  @Perm(permissions.CREATE)
  @ApiResult({ type: PMSubEntity })
  async batchCreate(@Body() data: BatchPmSubDto, @AuthUser() user: IAuthUser) {
    return await this.pmSubService.batchCreate(data, user?.uid)
  }

  @ApiOperation({
    summary: '子任务基础信息: 传pm_sub_id则视为更新,不传则视为新增',
  })
  @Put('createOrUpdate/baseInfo')
  @Perm(permissions.UPDATE)
  @ApiResult({ type: PMSubEntity })
  async createOrUpdate(@Body() data: BasePMSubDto, @AuthUser() user: IAuthUser) {
    return data.pm_sub_id ? await this.pmSubService.createBase(data, user?.uid) : await this.pmSubService.updateBase(data, user?.uid)
  }

  @ApiOperation({
    summary: '删除',
  })
  @Delete('delete')
  @Perm(permissions.DELETE)
  @ApiResult({ type: DeleteResult })
  async delete(@Body() data: IdsDto) {
    return await this.pmSubService.delete(data)
  }
}
