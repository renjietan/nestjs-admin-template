import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class BaseTableDto {
  @IsNotEmpty()
  @ApiProperty({
    description: '类型',
    example: 'VHF',
  })
  type: string

  @IsNotEmpty()
  @ApiProperty({
    description: '别名',
    example: '别名',
  })
  alias: string

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: '排序编号',
    example: 1,
  })
  order: number

  @ApiProperty()
  point_count: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  law_start?: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
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
