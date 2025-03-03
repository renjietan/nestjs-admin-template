import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { DeviceService } from './device.service'
import { DeviceDto } from './dto/device.dto'
import { SearchDto } from './dto/search.dto'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { DeviceEntity } from '~/entities/d_device'
import { IdsDto } from '~/common/dto/ids.dto'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { DeleteResult, UpdateResult } from 'typeorm'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { DictItemService } from '../system/dict-item/dict-item.service'

export const permissions = definePermission('device:manager', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Device - 设备管理')
@Controller('device')
@ApiSecurityAuth()
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly dict_item_service: DictItemService
  ) { }

  @ApiOperation({
    summary: '列表',
  })
  @Get()
  @ApiResult({ type: [ DeviceEntity ] })
  @Perm(permissions.LIST)
  async search(@Query() data: SearchDto) {
    return await this.deviceService.search(data)
  }

  // @ApiOperation({
  //   summary: '新增',
  // })
  // @Post()
  // @ApiResult({ type: DeviceEntity })
  // @Perm(permissions.CREATE)
  // async create(@Body() data: DeviceDto, @AuthUser() user: IAuthUser) {
  //   return await this.deviceService.create(data, user?.uid)
  // }

  // @ApiOperation({
  //   summary: '编辑',
  // })
  // @Post('update/:id')
  // @ApiResult({ type: UpdateResult })
  // @Perm(permissions.UPDATE)
  // async update(@Param('id') id: string, @Body() updateDto: DeviceDto,  @AuthUser() user: IAuthUser) {
  //   console.log('update', id, updateDto)
  //   return await this.deviceService.update(+id, updateDto, user?.uid)
  // }

  // @ApiOperation({
  //   summary: '删除',
  // })
  // @Post('del')
  // @ApiResult({ type: DeleteResult })
  // @Perm(permissions.DELETE)
  // async remove(@Body() idsDto: IdsDto) {
  //   console.log('remove', idsDto)
  //   return await this.deviceService.remove(idsDto)
  // }

  // @ApiOperation({
  //   summary: '根据ID查询设备详情',
  // })
  // @Post('findById/:id')
  // @ApiResult({ type: DeviceEntity })
  // @Perm(permissions.READ)
  // async findById(@Param('id') id: string) {
  //   return await this.deviceService.findById(+id)
  // }
}
