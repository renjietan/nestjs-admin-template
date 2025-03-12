import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateWaveDeviceConfigDto {
  @IsNotEmpty()
  @ApiProperty({ description: '名称', example: 'test' })
  name: string

  @IsOptional()
  @ApiProperty({ description: '范围（最小值）', example: '1', required: false })
  min_value: string

  @IsOptional()
  @ApiProperty({ description: '范围（最大值）', example: '22', required: false })
  max_value: string

  @IsNotEmpty()
  @ApiProperty({ description: '初始值', example: 'range' })
  initValue: string

  @IsOptional()
  @ApiProperty({ description: '单位', example: 'mhz', required: false })
  unit: string

  @IsOptional()
  @ApiProperty({ description: '枚举值', example: '1,2', required: false })
  group: string

  @IsOptional()
  @ApiProperty({ description: '值类型', example: 'male', required: false })
  valueType: string

  @IsOptional()
  @IsNotEmpty({
    message: 'deviceModel cannot be empty',
  })
  @ApiProperty({ description: '设备型号', example: 'male' })
  deviceModel: string

  @IsOptional()
  @ApiProperty({ description: '设备类型', example: "male", required: false })
  deviceType: string

  @IsOptional()
  @ApiProperty({ description: '步进值', example: '1', required: false })
  step_value: string

  @IsNotEmpty()
  @ApiProperty({ description: '波形类型', example: 'male' })
  waveType: string
}
