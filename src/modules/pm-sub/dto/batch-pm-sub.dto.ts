import { ApiProperty } from "@nestjs/swagger";
import { PMSubDto } from "./pm-sub.dto";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class BatchPmSubDto {
    @IsNotEmpty()
    @ValidateNested({
        each: true,
    })
    @ApiProperty({
        description: '',
        type: () => [PMSubDto],
        required: false,
    })
    @Type(() => PMSubDto)
    list: PMSubDto[]
}