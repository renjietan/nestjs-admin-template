import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UpdateFreqHopDto {
  @IsNotEmpty()
  @ValidateNested({
    each: true,
  })
  @ApiProperty()
  @Type(() => UpdateFreqHopBaseDto)
  data: UpdateFreqHopBaseDto[]
}

export class UpdateFreqHopBaseDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'id',
    example: 1,
  })
  id: number

  @IsNotEmpty()
  @ApiProperty({
    description: '值',
    example: 1,
  })
  value: number
}
