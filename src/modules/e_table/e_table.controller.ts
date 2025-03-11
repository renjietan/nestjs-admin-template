import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ETableService } from './e_table.service';
import { CreateETableDto } from './dto/create.e.table.dto';
import { UpdateETableDto } from './dto/update.e.table.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator';
import { IdParam } from '~/common/decorators/path-param.decorator';
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { ETableEntity } from '~/entities/e_table';
import { UpdateEncryptDto } from '../e_table_detail/dto/update.e.table.detail.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

export const permissions = definePermission('e:table', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)


@ApiTags('密钥表')
@ApiSecurityAuth()
@Controller('e-table')
export class ETableController {
  constructor(private readonly eTableService: ETableService) {}


  @ApiOperation({
    summary: '密钥表-列表'
  })
  @Get()
  @ApiResult({ type: [ETableEntity] })
  @Perm(permissions.LIST)
  findAll() {
    return this.eTableService.search();
  }

  @ApiOperation({
    summary: '密钥表-新增'
  })
  @Post()
  @ApiResult({ type: ETableEntity })
  @Perm(permissions.CREATE)
  create(@Body() createETableDto: CreateETableDto, @AuthUser() user:IAuthUser) {
    return this.eTableService.create(user?.uid, createETableDto);
  }

  @ApiOperation({
    summary: '密钥表-更新'
  })
  @Put('update/:id')
  @ApiResult({ type: UpdateResult })
  @Perm(permissions.UPDATE)
  update(@IdParam() id: number, @Body() updateETableDto: UpdateETableDto) {
    return this.eTableService.update(+id, updateETableDto);
  }

  @ApiOperation({
    summary: '密钥表-删除'
  })
  @Delete('delete/:id')
  @ApiResult({ type: DeleteResult })
  @Perm(permissions.DELETE)
  remove(@IdParam() id: string) {
    return this.eTableService.delete(+id);
  }
}
