import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class DeviceDto {
  @IsNotEmpty({
    message: 'SN cannot be empty',
  })
  @ApiProperty({ description: '设备号', example: 'SN001' })
  SN: string

  @IsNotEmpty({
    message: 'alias cannot be empty',
  })
  @ApiProperty({ description: '别名', example: '别名' })
  alias: string

  @IsNotEmpty({
    message: 'device_type cannot be empty',
  })
  @ApiProperty({ description: '设备类型', example: 'Handheld' })
  device_type: string

  @IsNotEmpty({
    message: 'model cannot be empty',
  })
  @ApiProperty({ description: '设备型号', example: 'PM200' })
  model: string

  @IsNotEmpty({
    message: 'status cannot be empty',
  })
  @ApiProperty({ description: '设备状态', example: 'normal' })
  status: string

  @ApiProperty({ description: '备注', example: 'MR9530', required: false })
  remarks: string
}
