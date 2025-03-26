import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PagerDto } from "~/common/dto/pager.dto";

export class SearchDto extends PagerDto {
    @IsString()
    @IsOptional({ always: true })
    @ApiProperty({ description: "设备号", required: false })
    SN: string;

    @IsString()
    @IsOptional({ always: true })
    @ApiProperty({ description: "别名", required: false })
    alias: string;

    @IsString()
    @IsOptional({ always: true })
    @ApiProperty({ description: "设备类型", required: false })
    device_type: string;

    @IsString()
    @IsOptional({ always: true })
    @ApiProperty({ description: "设备型号", required: false })
    model: string;

    @IsString()
    @IsOptional({ always: true })
    @ApiProperty({ description: "设备状态", required: false })
    status: string;

    @IsString()
    @IsOptional({ always: true })
    @ApiProperty({ description: "备注", required: false })
    remarks: string;
}
