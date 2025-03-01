import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class BaseFreqTableDto {
  @ApiProperty({
    description: 'id',
    example: '后台逻辑需要，前端不需要填',
  })
  id?: number

  @ApiProperty({
    description: '类型',
    example: 'VHF',
  })
  type: string

  @IsNotEmpty({
    message: 'count cannot be empty',
  })
  @ApiProperty({
    description: '数量：生成的表的数量',
    example: 10,
  })
  count?: number

  @ApiProperty({
    description: '数量：生成的频率值的数量',
    example: 232,
  })
  point_count?: number

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: '最小值：如果为空，采用 需求文档 中的 最小值',
    example: 30,
    required: false,
  })
  law_start?: number

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: '间隔：如果为空, 将会计算出 一个间隔值',
    example: 0,
    required: false,
  })
  law_spacing?: number

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: '最大值：如果为空，采用 需求文档 中的 最大值',
    example: 0,
    required: false,
  })
  law_end?: number
}
