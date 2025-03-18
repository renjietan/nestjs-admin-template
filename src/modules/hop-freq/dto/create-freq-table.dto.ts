import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
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
}
