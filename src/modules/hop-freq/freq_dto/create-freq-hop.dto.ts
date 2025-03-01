import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateFreqHopDto {
  @IsNotEmpty({
    message: 'f_table_id cannot be empty',
  })
  @ApiProperty({
    description: '创建人ID',
    example: 1,
  })
  f_table_id: number

  @IsNotEmpty({
    message: 'value cannot be empty',
  })
  @ApiProperty({
    description: '创建人ID',
    example: 1,
  })
  value: number

  @IsNotEmpty({
    message: 'createById cannot be empty',
  })
  @ApiProperty({
    description: '创建人ID',
    example: 1,
  })
  createById: number
}
