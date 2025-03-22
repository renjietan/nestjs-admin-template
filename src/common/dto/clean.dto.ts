import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Exact } from "./pager.dto";

export class AllowCleanDto {
  @IsOptional()
  @IsEnum(Exact)
  @ApiProperty({
    description: "是否允许清空表",
    enum: Exact,
    default: Exact.TRUE,
  })
  allow_clean: number;
}
