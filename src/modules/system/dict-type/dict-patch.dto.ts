import { ApiProperty, PartialType } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from "class-validator"
import { Exact } from "~/common/dto/pager.dto"
import { DictItemEntity } from "~/entities/dict-item.entity"
import { DictTypeEntity } from "~/entities/dict-type.entity"

class DictTypeByPatchDto extends PartialType(DictTypeEntity) {
    @ApiProperty({ description: '字典类型名称' })
    @IsString()
    @MinLength(1)
    name: string

    @ApiProperty({ description: '字典类型英文名称' })
    @IsString()
    @MinLength(1)
    en_name: string

    @ApiProperty({ description: '字典类型code' })
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


class DictItemByPatchDto extends PartialType(DictItemEntity) {
    @ApiProperty({ description: '字典类型 ID' })
    @IsOptional()
    @IsInt()
    typeId?: number

    @ApiProperty({ description: '字典项键名' })
    @IsString()
    @MinLength(1)
    label: string

    @ApiProperty({ description: '字典项英文名称' })
    @IsString()
    @MinLength(1)
    en_label: string

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


export class DictFullDto extends DictTypeByPatchDto {
    @ApiProperty({ description: '字典 + 字典项', type: [DictItemByPatchDto] })
    @IsNotEmpty()
    @IsArray()
    @Type(() => DictItemByPatchDto)
    @ValidateNested({ each: true })
    items: DictItemByPatchDto[]
}


export class PatchDto {
    @IsEnum(Exact)
    @ApiProperty({ description: '是否允许清空表', enum: Exact })
    @IsNotEmpty()
    allow_clean: number

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({
        each: true,
    })
    @Type(() => DictFullDto)
    @ApiProperty({
        description: '规则配置',
        type: () => [DictFullDto],
        required: false,
    })
    dicts: DictFullDto[]
}