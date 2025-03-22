import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested
} from "class-validator";
import { AllowCleanDto } from "~/common/dto/clean.dto";
import { ErrorEnum } from "~/constants/error-code.constant";
import { FTableEntity } from "~/entities/f-table";
import { IsUnique } from "~/shared/database/constraints/unique.constraint";

export class CreateTableDto {
  @IsUnique({ entity: FTableEntity, message: ErrorEnum.UniqueAliasRequired })
  @ApiProperty({ description: "别名", example: "别名" })
  alias: string;

  @IsNotEmpty()
  @ApiProperty({ description: "类型", example: "VHF" })
  type: string;

  @IsNumber()
  @ApiProperty({ description: "阈值-最小值", example: 1 })
  law_start: number;

  @IsNumber()
  @ApiProperty({ description: "阈值-间隔", example: 3 })
  law_spacing: number;

  @IsNumber()
  @ApiProperty({ description: "阈值-最大值", example: 100 })
  law_end: number;
}

export class CreateHzDtos extends AllowCleanDto{
  @IsDefined()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  values: number[];
}

export class CreateFreqTableDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => BaseFreqTableDto)
  @ApiProperty({
    description: "规则配置",
    type: () => [BaseFreqTableDto],
    required: false,
  })
  law_conf: BaseFreqTableDto[];
}

export class BaseFreqTableDto {
  @ApiHideProperty() // 完全隐藏
  @ApiProperty({
    description: "id",
    required: false,
  })
  id?: number;

  @IsNotEmpty()
  @ApiProperty({
    description: "类型",
    example: "VHF",
  })
  type: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "数量：生成的表的数量",
    example: 10,
  })
  count?: number;

  @IsNotEmpty()
  @ApiProperty({
    description: "数量：生成的频率值的数量",
    example: 232,
  })
  point_count?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: "最小值：如果为空，采用 需求文档 中的 最小值",
    example: 30,
    required: false,
  })
  law_start?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: "间隔：如果为空, 将会计算出 一个间隔值",
    example: 0,
    required: false,
  })
  law_spacing?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: "最大值：如果为空，采用 需求文档 中的 最大值",
    example: 0,
    required: false,
  })
  law_end?: number;
}
