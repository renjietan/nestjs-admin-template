import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PmMasterService } from './pm-master.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PMMasterDto } from './dto/pm-master.dto';
import { PMMasterSearchDto } from './dto/pm-master-search.dto';
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator';
import { IdsDto } from '~/common/dto/ids.dto';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { PMMasterEntity } from '~/entities/pm_master';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator';

export const permissions = definePermission('pm:master', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Task - 任务规划')
@Controller('pm-master')
export class PmMasterController {
  constructor(private readonly pm_master_service: PmMasterService) { }

  @ApiOperation({
    summary: '列表'
  })
  @Get()
  @ApiResult({ type: [PMMasterEntity] })
  @Perm(permissions.LIST)
  async search(@Query() data: PMMasterSearchDto) {
    return await this.pm_master_service.search(data)
  }

  @ApiOperation({
    summary: '新增'
  })
  @Post()
  @Perm(permissions.CREATE)
  @ApiResult({ type: PMMasterEntity })
  async create(@Body() data: PMMasterDto, @AuthUser() user:IAuthUser) {
    return await this.pm_master_service.create(data, user?.uid)
  }

  @ApiOperation({
    summary: '更新'
  })
  @Put("update/:id")
  @Perm(permissions.UPDATE)
  @ApiResult({ type: UpdateResult })
  async update(@Param('id') id, @Body() data: PMMasterDto, @AuthUser() user:IAuthUser) {
    return await this.pm_master_service.update(+id, data, user?.uid)
  }

  @ApiOperation({
    summary: '删除'
  })
  @Delete("delete")
  @Perm(permissions.DELETE)
  @ApiResult({ type: DeleteResult })
  async delete(@Body() ids: IdsDto) {
    return await this.pm_master_service.delete(ids)
  }
}
