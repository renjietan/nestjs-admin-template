import { IsNumber, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateFreqTableDto {
  @IsNumber()
  @ApiProperty({
    description: '别名',
    example: '别名',
  })
  alias: string

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
