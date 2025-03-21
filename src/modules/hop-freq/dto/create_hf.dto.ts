import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional } from 'class-validator'
import { ErrorEnum } from '~/constants/error-code.constant'
import { FTableEntity } from '~/entities/f-table'
import { IsUnique } from '~/shared/database/constraints/unique.constraint'

export class CreateHF {
  @IsUnique({ entity: FTableEntity, message: ErrorEnum.TableNameExists })
  @ApiProperty({
    description: '别名',
    example: '别名',
  })
  alias: string

  @ApiProperty({
    description: '类型',
    example: 'VHF',
  })
  type: string

  @ApiProperty()
  point_count: number

  @IsNumber()
  @ApiProperty()
  law_start: number

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  law_spacing: number

  @IsNumber()
  @ApiProperty({
    description: '最大值：如果为空，采用 需求文档 中的 最大值',
    example: 0,
  })
  law_end: number

  @IsArray()
  @ApiProperty({
    description: '频点列表',
  })
  points: []
}
