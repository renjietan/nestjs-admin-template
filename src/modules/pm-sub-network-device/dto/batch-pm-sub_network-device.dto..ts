import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PMSubNetWorkDeviceDto } from './pm-sub_network-device.dto'

export class BatchPMSubNetWorkDeviceDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({
    each: true,
  })
  @Type(() => PMSubNetWorkDeviceDto)
  @ApiProperty({ description: '任务规划-子任务-设备集合', type: [PMSubNetWorkDeviceDto] })
  data: PMSubNetWorkDeviceDto[]
}
