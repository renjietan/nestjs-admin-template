import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class BatchCreateEncryptDto {
  @IsNotEmpty({
    message: '表ID不可为空'
  })
  @IsInt({
    message: '请传入数字'
  })
  @ApiProperty({ description: "表ID", example: 1})
  tableId: number;

  @IsInt({
    message: '请传入数字'
  })
  @IsNotEmpty({
    message: '长度不为空'
  })
  @ApiProperty({ description: "长度", example: 10 })
  length: number;

  @IsNotEmpty({
    message: '生效开始日期不为空'
  })
  @ApiProperty({ description: "生效开始日期", example: 10 })
  startDate: string;

  @IsInt({
    message: '请传入数字'
  })
  @IsNotEmpty({
    message: '天数不为空'
  })
  @ApiProperty({ description: "天数", example: 10 })
  days: number;

  @IsNotEmpty({
    message: '波形类型不可为空'
  })
  @ApiProperty({ description: "波形类型", example: "MR9360" })
  waveType: string;
}
