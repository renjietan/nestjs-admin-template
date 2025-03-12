import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'

export class CreateETableDto {
  @IsNotEmpty()
  @ApiProperty({ description: '表名称', example: 'XXX密钥表' })
  name: string

  @IsNotEmpty()
  @ApiProperty({ description: '开始日期', example: '2024-01-01' })
  startDate: string

  @IsInt()
  @IsNotEmpty({
    message: 'days cannot be empty',
  })
  @ApiProperty({ description: '天数', example: 10 })
  days: number

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: '每次生成多少条随机数据', example: 10 })
  r_size: number

  @IsNotEmpty()
  @ApiProperty({ description: '波形类型: MR9530(11-500), MR9560(16)', example: 'MR9530' })
  waveType: string

  @IsNotEmpty()
  @ApiProperty({ description: '是否直接生成随机密钥表数据  1 => 生成  0 => 不生成', example: 1 })
  g_random: number
}
