import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator';
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator';
import { IdParam } from '~/common/decorators/path-param.decorator';
import { ETableDetailEntity } from '~/entities/e_table_detail';
import { BatchCreateEncryptDto } from './dto/batchCreate.e.table.detail.dto';
import { CreateEncryptDto } from './dto/create.e.table.detail.dto';
import { SearchEncryptDto } from './dto/search.e.table.detail.dto';
import { UpdateEncryptDto } from './dto/update.e.table.detail.dto';
import { ETableDetailService } from './e_table_detail.service';

export const permissions = definePermission('e:tableDetail', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Encrypt - 密钥表(详情)')
@Controller('e-table-detail')
export class ETableDetailController {
  constructor(private readonly eTableDetailService: ETableDetailService) { }

  @ApiOperation({
    summary: '列表',
    description: "field默认: channelNo, order默认: ASC"
  })
  @Get()
  @ApiResult({ type: [ETableDetailEntity] })
  @Perm(permissions.LIST)
  getList(@Query() data: SearchEncryptDto) {
    return this.eTableDetailService.search(data);
  }

  @ApiOperation({
    summary: '新增'
  })
  @Post('craete')
  @ApiResult({ type: ETableDetailEntity })
  @Perm(permissions.CREATE)
  create(@Body() createETableDetailDto: CreateEncryptDto, @AuthUser() user: IAuthUser) {
    return this.eTableDetailService.create(user?.uid, createETableDetailDto);
  }

  @ApiOperation({
    summary: '批量',
    description: "先删除,再批量新增"
  })
  @Patch('batchCreate')
  @ApiResult({ type: [ETableDetailEntity] })
  @Perm(permissions.CREATE)
  batchCreate(@Body() data: BatchCreateEncryptDto, @AuthUser() user: IAuthUser) {
    return this.eTableDetailService.insertRandomData(user?.uid, data);
  }

  @ApiOperation({
    summary: '删除'
  })
  @Delete("delete/:id")
  @ApiResult({ type: DeleteResult })
  @Perm(permissions.DELETE)
  remove(@IdParam() id: string) {
    return this.eTableDetailService.delete(+id);
  }

  @ApiOperation({
    summary: '根据tableId删除'
  })
  @Delete("deleteByTableId/:tableId")
  @ApiResult({ type: DeleteResult })
  @Perm(permissions.DELETE)
  removeByTableId(@Param("tableId") tableId: string) {
    return this.eTableDetailService.deleteByTableId(+tableId);
  }

  @ApiOperation({
    summary: '更新',
    description: '根据id更新,如果需要软删除,传入isDelete = 1'
  })
  @Put("update/:id")
  @ApiResult({ type: UpdateResult })
  @Perm(permissions.UPDATE)
  update(@IdParam() id: string, @Body() updateETableDetailDto: UpdateEncryptDto) {
    return this.eTableDetailService.update(+id, updateETableDetailDto);
  }
}
