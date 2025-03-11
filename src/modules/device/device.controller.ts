import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { DeviceService } from './device.service'
import { DeviceDto } from './dto/device.dto'
import { SearchDto } from './dto/search.dto'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { DeviceEntity } from '~/entities/d_device'
import { IdsDto } from '~/common/dto/ids.dto'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { DictItemService } from '../system/dict-item/dict-item.service'
import { DictItemEntity } from '~/entities/dict-item.entity'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { IdParam } from '~/common/decorators/path-param.decorator'

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
  @ApiResult({ type: [DeviceEntity] })
  @Perm(permissions.LIST)
  async search(@Query() data: SearchDto) {
    return await this.deviceService.search(data)
  }

  @ApiOperation({
    summary: '新增',
  })
  @Post()
  @ApiResult({ type: InsertResult })
  @Perm(permissions.CREATE)
  async create(@Body() data: DeviceDto, @AuthUser() user: IAuthUser) {
    let { device_type, model, status } = data
    let res = await this.dict_item_service.page({})
    let { items } = res
    let dict_entity = items.reduce((cur, pre: DictItemEntity) => {
      if (pre.value == device_type) {
        cur.device_type = device_type
      } else if (pre.value == model) {
        cur.model = model
      } else if (pre.value == status) {
        cur.status = status
      }
      return cur
    }, {
      device_type: null,
      model: null,
      status: null
    })
    if(Object.values(dict_entity).every(item => !!item)) {
      throw new BusinessException('The dictionary does not exist ')
    }
    return await this.deviceService.create(data, user?.uid)
  }

  @ApiOperation({
    summary: '编辑',
  })
  @Put('update/:id')
  @ApiResult({ type: UpdateResult })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: string, @Body() updateDto: DeviceDto,  @AuthUser() user: IAuthUser) {
    console.log('update', id, updateDto)
    return await this.deviceService.update(+id, updateDto, user?.uid)
  }

  @ApiOperation({
    summary: '删除',
  })
  @Delete('del')
  @ApiResult({ type: DeleteResult })
  @Perm(permissions.DELETE)
  async remove(@Body() idsDto: IdsDto) {
    console.log('remove', idsDto)
    return await this.deviceService.remove(idsDto)
  }

  @ApiOperation({
    summary: '根据ID查询设备详情',
  })
  @Post('findById/:id')
  @ApiResult({ type: DeviceEntity })
  @Perm(permissions.READ)
  async findById(@Param('id') id: string) {
    return await this.deviceService.findById(+id)
  }
}
