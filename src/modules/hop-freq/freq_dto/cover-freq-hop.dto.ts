import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CoverFreqHopDto {
  @IsNotEmpty({
    message: 'values cannot be empty',
  })
  @ApiProperty({
    description: '需要覆盖的频点值',
    example: '30,30.5',
  })
  values: string

  @IsNotEmpty({
    message: 'type cannot be empty',
  })
  @ApiProperty({
    description: 'type',
    example: 'VHF',
  })
  type: string

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

  @IsNotEmpty({
    message: 'f_table_id cannot be empty',
  })
  @ApiProperty({
    description: '表ID',
    example: 1,
  })
  f_table_id: number

  @IsNotEmpty({
    message: 'createById cannot be empty',
  })
  @ApiProperty({
    description: '创建人ID',
    example: 1,
  })
  createById: number
}
