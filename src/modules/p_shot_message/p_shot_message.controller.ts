import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { PShotMessageService } from './p_shot_message.service';
import { CreatePShotMessageDto } from './dto/create-p_shot_message.dto';
import { UpdatePShotMessageDto } from './dto/update-p_shot_message.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchPShotMessageDto } from './dto/search-p_shot_message.dto';
import { IdParam } from '~/common/decorators/path-param.decorator';
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator';
import { IdsDto } from '~/common/dto/ids.dto';
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { PShotMessageEntity } from '~/entities/p_shot_message';
import { DeleteResult, UpdateResult } from 'typeorm';


export const permissions = definePermission('p:shotmsg', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)



@ApiTags('ShotMessage - 短信模块')
@Controller('p-shot-message')
export class PShotMessageController {
  constructor(private readonly pShotMessageService: PShotMessageService) { }

  @Post()
  @ApiOperation({
    summary: '新增',
  })
  @ApiResult({ type: PShotMessageEntity })
  @Perm(permissions.CREATE)
  async create(@Body() createPShotMessageDto: CreatePShotMessageDto, @AuthUser() user:IAuthUser) {
    return await this.pShotMessageService.create(createPShotMessageDto, user?.uid);
  }

  @Get()
  @ApiOperation({
    summary: '列表：所有参数可选，  若传了pageNum, 则需要传pageSize, 否则 依然不会做分页处理',
  })
  @ApiResult({ type: [PShotMessageEntity] })
  @Perm(permissions.LIST)
  async findAll(@Query() data: SearchPShotMessageDto) {
    return await this.pShotMessageService.findAll(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: '编辑',
  })
  @ApiResult({ type: UpdateResult })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body() updatePShotMessageDto: UpdatePShotMessageDto, @AuthUser() user:IAuthUser) {
    return await this.pShotMessageService.update(+id, updatePShotMessageDto, user?.uid);
  }

  @Delete('delete/:ids')
  @ApiOperation({
    summary: '根据id删除, 删除多个， 传入 - 分隔的ID',
  })
  @ApiResult({ type: DeleteResult })
  @Perm(permissions.DELETE)
  async remove(@Body() idsDto: IdsDto) {
    return await this.pShotMessageService.remove(idsDto);
  }
}
