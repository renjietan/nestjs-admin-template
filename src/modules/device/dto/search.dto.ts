import { ApiProperty } from "@nestjs/swagger";
import { IsInstance, IsInt, IsNotEmpty, registerDecorator, ValidatorOptions } from "class-validator";
import { PagerDto } from "~/common/dto/pager.dto";

export class SearchDto extends PagerDto {
    @ApiProperty({ description: "设备号", example: 'SN001', required: false })
    SN: string;

    @ApiProperty({ description: "别名", example: '别名', required: false })
    alias: string;

    @ApiProperty({ description: "设备类型", example: "Handheld", required: false })
    device_type: string;

    @ApiProperty({ description: "设备型号", example: "PM200", required: false })
    model: string;

    @ApiProperty({ description: "设备状态", example: "normal", required: false })
    status: string;

    @ApiProperty({ description: "备注", example: "MR9530", required: false })
    remarks: string;
}
