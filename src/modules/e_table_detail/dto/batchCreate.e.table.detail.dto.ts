import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class BatchCreateEncryptDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: "表ID", example: 1})
  table_id: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: "长度", example: 10 })
  length: number;

  @IsNotEmpty()
  @ApiProperty({ description: "生效开始日期", example: 10 })
  startDate: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: "天数", example: 10 })
  days: number;

  @IsNotEmpty()
  @ApiProperty({ description: "波形类型", example: "MR9360" })
  waveType: string;
}
