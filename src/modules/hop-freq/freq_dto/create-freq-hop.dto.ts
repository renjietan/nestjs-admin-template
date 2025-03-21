import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateFreqHopDto {
  @IsNotEmpty()
  @ApiProperty({
    description: '创建人ID',
    example: 1,
  })
  f_table_id: number

  @IsNotEmpty()
  @ApiProperty({
    description: '创建人ID',
    example: 1,
  })
  value: number

  @IsNotEmpty()
  @ApiProperty({
    description: '排序',
    example: 1,
  })
  order: number
}
