import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UpdateFreqHopDto {
  @IsNotEmpty({
    message: 'data cannot be empty',
  })
  @ValidateNested({
    each: true,
  })
  @ApiProperty({
    description: '',
    type: () => [UpdateFreqHopBaseDto],
    required: false,
  })
  @Type(() => UpdateFreqHopBaseDto)
  data: UpdateFreqHopBaseDto[]
}

export class UpdateFreqHopBaseDto {
  @IsNotEmpty({
    message: 'id cannot be empty',
  })
  @ApiProperty({
    description: 'id',
    example: 1,
  })
  id: number

  @IsNotEmpty({
    message: 'value cannot be empty',
  })
  @ApiProperty({
    description: '值',
    example: 1,
  })
  value: number
}
