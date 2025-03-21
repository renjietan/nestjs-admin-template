import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator'

export class CoverFreqHopDto {
  @IsNotEmpty()
  @ApiProperty({
    description: '需要覆盖的频点值',
    example: '30,30.5',
  })
  values: string

  @IsNotEmpty()
  @ApiProperty({
    description: 'type',
    example: 'VHF',
  })
  type: string

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  order: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  law_start: number


  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: '间隔：如果为空, 将会计算出 一个间隔值',
    example: 0,
    required: false,
  })
  law_spacing?: number


  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  law_end?: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  f_table_id: number
}
