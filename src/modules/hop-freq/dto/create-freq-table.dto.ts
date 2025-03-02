import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseFreqTableDto } from './base-freq-table.dto'

export class CreateFreqTableDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => BaseFreqTableDto)
  @ApiProperty({
    description: '规则配置',
    type: () => [BaseFreqTableDto],
    required: false,
  })
  law_conf: BaseFreqTableDto[]


  // @IsNotEmpty({
  //   message: 'createById cannot be empty',
  // })
  // @ApiProperty({
  //   description: '创建人ID',
  //   example: 1,
  // })
  // createById: number
}
