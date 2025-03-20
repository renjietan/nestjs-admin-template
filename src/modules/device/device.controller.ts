import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { IdParam } from '~/common/decorators/path-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { IdsDto } from '~/common/dto/ids.dto'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { DeviceEntity } from '~/entities/d_device'
import { DictItemEntity } from '~/entities/dict-item.entity'
import { DictItemService } from '../system/dict-item/dict-item.service'
import { DeviceService } from './device.service'
import { DeviceDto } from './dto/device.dto'
import { SearchDto } from './dto/search.dto'

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
    private readonly dict_item_service: DictItemService,
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
    const { device_type, model, status } = data
    const res = await this.dict_item_service.page({})
    const { items } = res
    const dict_entity = items.reduce((cur, pre: DictItemEntity) => {
      if (pre.value == device_type) {
        cur.device_type = device_type
      }
      else if (pre.value == model) {
        cur.model = model
      }
      else if (pre.value == status) {
        cur.status = status
      }
      return cur
    }, {
      device_type: null,
      model: null,
      status: null,
    })
    if (Object.values(dict_entity).every(item => !!item)) {
      throw new BusinessException(ErrorEnum.OperationFailedDictionaryOrParameterError)
    }
    return await this.deviceService.create(data, user?.uid)
  }

  @ApiOperation({
    summary: '编辑',
  })
  @Put('update/:id')
  @ApiResult({ type: UpdateResult })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: string, @Body() updateDto: DeviceDto, @AuthUser() user: IAuthUser) {
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
