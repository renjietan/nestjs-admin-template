import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PMSubNetWorkDeviceDto } from '../../pm-sub-network-device/dto/pm-sub_network-device.dto'

export class PMSubDto {
  @ApiProperty({ description: '任务规划-子任务-ID', example: 1, required: false })
  pm_sub_id: number

  @IsNotEmpty({
    message: 'ip_addr cannot be empty',
  })
  @ApiProperty({ description: '任务规划-子任务-名称', example: '任务规划-子任务-名称' })
  pm_sub_name: string

  @IsNotEmpty({
    message: 'network_addr cannot be empty',
  })
  @ApiProperty({ description: '任务规划-子任务-开始时间', example: '2025-01-01' })
  pm_sub_startTime: string

  @IsNotEmpty({
    message: 'pm_sub_endTime cannot be empty',
  })
  @ApiProperty({ description: '任务规划-子任务-结束时间', example: '2025-12-01' })
  pm_sub_endTime: string

  @IsNotEmpty({
    message: 'pm_sub_desc cannot be empty',
  })
  @ApiProperty({ description: '任务规划-子任务-备注', example: '任务规划-子任务-备注' })
  pm_sub_desc: string

  @IsArray()
  @IsNotEmpty({
    message: 'devices cannot be empty',
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => PMSubNetWorkDeviceDto)
  @ApiProperty({ description: '任务规划-子任务-设备集合', type: [PMSubNetWorkDeviceDto] })
  devices: PMSubNetWorkDeviceDto[]
}
