import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateWaveDeviceConfigDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'id', example: '28' })
  id: string

  @IsNotEmpty()
  @ApiProperty({ description: '名称', example: 'test1' })
  name: string

  @IsOptional()
  @ApiProperty({ description: '值1', example: '22', required: false })
  min_value: string

  @IsOptional()
  @ApiProperty({ description: '值2', example: '33', required: false })
  max_value: string

  @IsOptional()
  @ApiProperty({ description: '初始值', example: '33', required: false })
  initValue: string

  @IsOptional()
  @ApiProperty({ description: '单位', example: 'hz', required: false })
  unit: string

  @IsOptional()
  @ApiProperty({ description: '枚举值', example: '4,5', required: false })
  group: string

  @IsOptional()
  @ApiProperty({ description: '值类型', example: 'select', required: false })
  valueType: string

  @IsNotEmpty()
  @ApiProperty({ description: '设备型号', example: 'PMR2000' })
  deviceModel: string

  @IsOptional()
  @ApiProperty({ description: '设备类型', example: "字典编码", required: false })
  deviceType: string

  @IsOptional()
  @ApiProperty({ description: '步进值', example: '1', required: false })
  step_value: string

  @IsNotEmpty()
  @ApiProperty({ description: '波形类型', example: 'FF' })
  waveType: string
}
