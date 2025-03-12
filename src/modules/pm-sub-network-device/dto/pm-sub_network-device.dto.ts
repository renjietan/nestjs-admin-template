import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class PMSubNetWorkDeviceDto {
  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-主任务-ip地址', example: '192.168.1.1' })
  ip_addr: string

  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-主任务-网关地址', example: '255.255.255.0' })
  network_addr: string

  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-子任务-私有配置', example: '{obj: 1}' })
  private_conf: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-子任务-是否为master', example: 1 })
  isMaster: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '任务规划-子任务-设备ID', example: 1 })
  deviceId: number
}
