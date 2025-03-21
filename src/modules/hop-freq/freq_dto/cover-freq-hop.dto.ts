import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

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
    example: 'VHF'
  })
  type: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  f_table_id: number
}
