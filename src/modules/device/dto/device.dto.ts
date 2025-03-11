import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class DeviceDto {
  @IsNotEmpty()
  @ApiProperty({ description: '设备号', example: 'SN001' })
  SN: string

  @IsNotEmpty()
  @ApiProperty({ description: '别名', example: '别名' })
  alias: string

  @IsNotEmpty()
  @ApiProperty({ description: '设备类型', example: 'Handheld' })
  device_type: string

  @IsNotEmpty()
  @ApiProperty({ description: '设备型号', example: 'PM200' })
  model: string

  @IsNotEmpty()
  @ApiProperty({ description: '设备状态', example: 'normal' })
  status: string

  @IsOptional()
  @ApiProperty({ description: '备注', example: '备注' })
  remarks?: string
}
