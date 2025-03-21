import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber
} from "class-validator";
import { Exact } from "~/common/dto/pager.dto";
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

export class CreateHzDtos {
  @IsEnum(Exact)
  @ApiProperty({ description: "是否允许清空表", enum: Exact, default: Exact.TRUE })
  allow_clean: number;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  values: number[];
}


