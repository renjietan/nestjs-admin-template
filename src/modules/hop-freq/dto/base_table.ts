import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class BaseTableDto {
  @IsNotEmpty({
    message: 'type can be not empty'
  })
  @ApiProperty({
    description: '类型',
    example: 'VHF',
  })
  type: string

  @IsNotEmpty({
    message: 'alias can be not empty'
  })
  @ApiProperty({
    description: '别名',
    example: '别名',
  })
  alias: string

  @ApiProperty({
    description: '数量：生成的频率值的数量',
    example: 232,
  })
  point_count: number

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
