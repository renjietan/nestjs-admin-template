import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateETableDto {
  @IsNotEmpty({
    message: 'name cannot be empty',
  })
  @ApiProperty({ description: '表名称', example: 'XXX密钥表' })
  name: string

  @IsNotEmpty({
    message: 'startDate cannot be empty',
  })
  @ApiProperty({ description: '开始日期', example: '2024-01-01' })
  startDate: string

  @IsNotEmpty({
    message: 'waveType cannot be empty',
  })
  @ApiProperty({ description: '开始日期', example: '2024-01-01' })
  waveType: string

  @IsNotEmpty({
    message: 'waveType cannot be empty',
  })
  @ApiProperty({ description: '天数', example: 10 })
  days: number
}
