import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { WaveDeviceConfigService } from './wave_device_config.service'
import { CreateWaveDeviceConfigDto } from './dto/createOne.dto'
import { BatchCreateWaveDeviceConfigDto } from './dto/batchCreate.dto'
import { SearcheWaveDeviceConfigDto } from './dto/search.dto'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { WaveDeviceConfigEntity } from '~/entities/wave_device_config'
import { DeleteResult } from 'typeorm'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { IdParam } from '../../common/decorators/path-param.decorator';

export const permissions = definePermission('wave:config', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Wave - 设备配置')
@Controller('wave-device-config')
export class WaveDeviceConfigController {
  constructor(
    private readonly wave_device_config_service: WaveDeviceConfigService,
  ) { }

  @ApiOperation({
    summary: '波-设备配置-列表查询',
  })
  @Get('search')
  @ApiResult({ type: [WaveDeviceConfigEntity] })
  @Perm(permissions.LIST)
  async search(@Query() params: SearcheWaveDeviceConfigDto) {
    return await this.wave_device_config_service.search(params)
  }

  @ApiOperation({
    summary: '波-设备配置-新增',
  })
  @Post('create')
  @ApiResult({ type: WaveDeviceConfigEntity })
  @Perm(permissions.CREATE)
  async create(@Query() createDto: CreateWaveDeviceConfigDto, @AuthUser() user: IAuthUser) {
    return await this.wave_device_config_service.create(createDto, user?.uid)
  }

  @ApiOperation({
    summary: '波-设备配置-批量新增(注:调用此接口,将先清空【设备配置】表里的数据;参数说明查看:BatchCreateWaveDeviceConfigDto)',
  })
  @Post('batchCreate')
  @ApiResult({ type: [WaveDeviceConfigEntity] })
  @Perm(permissions.CREATE)
  async batchCreate(@Body() createDto: BatchCreateWaveDeviceConfigDto, @AuthUser() user: IAuthUser) {
    return await this.wave_device_config_service.batchCreate(createDto, user?.uid)
  }

  @ApiOperation({
    summary: '波-设备配置-根据id删除(若需要删除全部, 则传入-1)',
  })
  @Delete('delete/:id')
  @ApiResult({ type: DeleteResult })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number) {
    return await this.wave_device_config_service.delete(id == -1 ? null : id)
  }
}
