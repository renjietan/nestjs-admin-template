import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SubDto {
    @IsNotEmpty()
    @ApiProperty({ description: '子任务名称' })
    pm_sub_name: string;

    @IsNotEmpty()
    @ApiProperty({ description: '子任务-开始时间' })
    pm_sub_startTime: string;
    
    @IsNotEmpty()
    @ApiProperty({ description: '子任务-结束时间' })
    pm_sub_endTime: string;

    @IsNotEmpty()
    @ApiProperty({ description: '子任务-描述信息' })
    pm_sub_desc: string;
}