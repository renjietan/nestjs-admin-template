import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator';
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator';
import { IdParam } from '~/common/decorators/path-param.decorator';
import { IdsDto } from '~/common/dto/ids.dto';
import { PShotMessageEntity } from '~/entities/p_shot_message';
import { CreatePShotMessageDto } from './dto/create-p_shot_message.dto';
import { SearchPShotMessageDto } from './dto/search-p_shot_message.dto';
import { UpdatePShotMessageDto } from './dto/update-p_shot_message.dto';
import { PShotMessageService } from './p_shot_message.service';


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

  @Get()
  @ApiOperation({
    summary: '列表',
  })
  @ApiResult({ type: [PShotMessageEntity] })
  @Perm(permissions.LIST)
  async findAll(@Query() data: SearchPShotMessageDto) {
    return await this.pShotMessageService.findAll(data);
  }

  @Post()
  @ApiOperation({
    summary: '新增',
  })
  @ApiResult({ type: PShotMessageEntity })
  @Perm(permissions.CREATE)
  async create(@Body() createPShotMessageDto: CreatePShotMessageDto, @AuthUser() user:IAuthUser) {
    return await this.pShotMessageService.create(createPShotMessageDto, user?.uid);
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
    summary: '删除',
  })
  @ApiResult({ type: DeleteResult })
  @Perm(permissions.DELETE)
  async remove(@Body() idsDto: IdsDto) {
    return await this.pShotMessageService.remove(idsDto);
  }
}
