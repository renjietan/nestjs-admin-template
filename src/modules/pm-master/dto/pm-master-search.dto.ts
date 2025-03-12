import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PagerDto } from "~/common/dto/pager.dto";

export class PMMasterSearchDto extends PagerDto  {
  @IsOptional()
  @ApiProperty({ description: "任务规划-主任务-名称", example: '任务规划-主任务-名称', required: false })
  pm_name?: string;
}
