import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator'

import { Exact, PagerDto } from '~/common/dto/pager.dto'

import { IsUnique } from '~/shared/database/constraints/unique.constraint'

import { Type } from 'class-transformer'
import { DictTypeEntity } from '../../../entities/dict-type.entity'
import { DictItemDto } from '../dict-item/dict-item.dto'

export class DictTypeDto extends PartialType(DictTypeEntity) {
  @ApiProperty({ description: '字典类型名称' })
  @IsUnique({ entity: DictTypeEntity, message: '已存在相同名称的字典' })
  @IsString()
  @MinLength(1)
  name: string

  @ApiProperty({ description: '字典类型英文名称' })
  @IsUnique({ entity: DictTypeEntity, message: '已存在相同英文名称的字典' })
  @IsString()
  @MinLength(1)
  en_name: string

  @ApiProperty({ description: '字典类型code' })
  @IsUnique({ entity: DictTypeEntity, message: '已存在相同编码的字典' })
  @IsString()
  @MinLength(3)
  code: string

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @IsInt()
  status?: number

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class DictTypeQueryDto extends PagerDto {
  @ApiProperty({ description: '字典类型名称' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '字典类型code' })
  @IsString()
  @IsOptional()
  code?: string
}

export class DictFullDto extends DictTypeDto{
  @ApiProperty({ description: '字典项集合不可为空', example: [DictTypeDto] })
  @MinLength(1)
  @IsNotEmpty()
  @Type(() => DictItemDto)
  @ValidateNested({ each: true })
  items: DictItemDto[]
}


export class PatchDto {
  @IsEnum(Exact)
  @ApiProperty({ description: '是否允许清空表', enum: Exact })
  @IsNotEmpty()
  allow_clean: number

  @ApiProperty({ description: '字典集合不可为空', example: [DictFullDto] })
  @MinLength(1)
  @IsNotEmpty()
  @Type(() => DictFullDto)
  @ValidateNested({ each: true })
  dicts: DictFullDto[]
}