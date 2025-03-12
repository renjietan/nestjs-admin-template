import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PmSubNetWorkDeviceService } from './pm-sub-network-device.service'
import { PMSubNetWorkDeviceDto } from './dto/pm-sub_network-device.dto'
import { BatchPMSubNetWorkDeviceDto } from './dto/batch-pm-sub_network-device.dto.'
import { definePermission, Perm } from '~/common/decorators/auth/permission.decorator'
import { IdsDto } from '~/common/dto/ids.dto'
import { AuthUser } from '~/common/decorators/auth/auth-user.decorator'
import { ApiResult } from '~/common/decorators/api-result.decorator'
import { PMSubNetWorkDeviceEntity } from '~/entities/pm_sub_network_device'
import { DeleteResult } from 'typeorm'


export const permissions = definePermission('pm:device', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)


@ApiTags('Task - 子任务 - 设备新增')
@Controller('pm-sub-net-work-device')
export class PmSubNetWorkDeviceController {
  constructor(private readonly pmSubNetWorkDeviceService: PmSubNetWorkDeviceService) { }

  @ApiOperation({
    summary: '新增',
  })
  @Post(':pm_id')
  @Perm(permissions.CREATE)
  @ApiResult({ type: PMSubNetWorkDeviceEntity })
  async create(@Param('pm_id') pm_id: string, @Body() dto: PMSubNetWorkDeviceDto, @AuthUser() user: IAuthUser) {
    return await this.pmSubNetWorkDeviceService.create(dto, +pm_id, user?.uid)
  }

  @ApiOperation({
    summary: '批量新增: 先删除子任务下所有设备，然后再新增',
  })
  @Patch('batchCreate/:pm_sub_id')
  @Perm(permissions.CREATE)
  @ApiResult({ type: PMSubNetWorkDeviceEntity })
  async batchCreate(@Param('pm_sub_id') pm_sub_id: string, @Body() dto: BatchPMSubNetWorkDeviceDto, @AuthUser() user: IAuthUser) {
    return await this.pmSubNetWorkDeviceService.batchCreate(+pm_sub_id, dto, user?.uid)
  }

  @ApiOperation({
    summary: '根据ID批量删除设备',
  })
  @Delete('device')
  @Perm(permissions.DELETE)
  @ApiResult({ type: DeleteResult })
  async delete(@Body() dto: IdsDto) {
    return await this.pmSubNetWorkDeviceService.delete(dto)
  }

  @ApiOperation({
    summary: '删除子任务下所有设备',
  })
  @Delete('deleteByPmId/:pm_sub_id')
  @ApiResult({ type: DeleteResult })
  @Perm(permissions.DELETE)
  async deleteByPmId(@Param('pm_sub_id') pm_sub_id: string) {
    return await this.pmSubNetWorkDeviceService.deleteByPmId(+pm_sub_id)
  }
}
