import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class GFreqHopDto {
  @IsNotEmpty()
  @ApiProperty({
    description: '需要生成的数量: 如果为空，采用需求文档中的默认值',
    example: 232,
  })
  point_count: number

  @IsNotEmpty()
  @ApiProperty({
    description: 'type',
    example: 'VHF',
  })
  type: string

  @IsOptional()
  @ApiProperty({
    description: '最小值：如果为空，采用 需求文档 中的 最小值',
    example: 30,
    required: false,
  })
  law_start?: number

  @IsOptional()
  @ApiProperty({
    description: '间隔：如果为空, 将会计算出 一个间隔值',
    example: 0,
    required: false,
  })
  law_spacing?: number

  @IsOptional()
  @ApiProperty({
    description: '最大值：如果为空，采用 需求文档 中的 最大值',
    example: 0,
    required: false,
  })
  law_end?: number
}
