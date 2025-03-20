import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

import { IsUnique } from '~/shared/database/constraints/unique.constraint'
import { DictItemEntity } from '../../../entities/dict-item.entity'

export class DictItemDto extends PartialType(DictItemEntity) {
  @ApiProperty({ description: '字典类型 ID' })
  @IsInt()
  typeId: number

  @IsUnique({ entity: DictItemEntity, message: '已存在相同名称的字典类型项' })
  @ApiProperty({ description: '字典项键名' })
  @IsString()
  @MinLength(1)
  label: string

  @IsUnique({ entity: DictItemEntity, message: '已存在相同英文名称的字典项' })
  @ApiProperty({ description: '字典项英文名称' })
  @IsString()
  @MinLength(1)
  en_label: string

  @IsUnique({ entity: DictItemEntity, message: '已存在相同编码的字典项' })
  @ApiProperty({ description: '字典项值' })
  @IsString()
  @MinLength(1)
  value: string

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @IsInt()
  status?: number

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class DictItemQueryDto extends PagerDto {
  @ApiProperty({ description: '字典类型 ID', required: false })
  @IsOptional()
  @IsInt()
  typeId?: number

  @ApiProperty({ description: '字典项键名' })
  @IsString()
  @IsOptional()
  label?: string

  @ApiProperty({ description: '字典项值' })
  @IsString()
  @IsOptional()
  value?: string
}
