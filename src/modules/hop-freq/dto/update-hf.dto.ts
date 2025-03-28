import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateTableDto {
  @IsNotEmpty()
  @ApiProperty({ description: "别名", example: "别名" })
  alias?: string;

  @IsOptional()
  @ApiProperty({ description: "类型", example: "VHF" })
  type?: string;

  @IsOptional()
  @ApiProperty({ description: "阈值-最小值", example: 1 })
  law_start?: number;

  @IsOptional()
  @ApiProperty({ description: "阈值-间隔", example: 3 })
  law_spacing?: number;

  @IsOptional()
  @ApiProperty({ description: "阈值-最大值", example: 100 })
  law_end?: number;
}