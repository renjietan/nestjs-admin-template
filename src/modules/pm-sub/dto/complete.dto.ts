import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { SubNetWorkDeviceDto } from "./sub-network-device.dto";
import { SubDto } from "./sub.dto";

export class CompleteDto {
    @IsOptional()
    @ApiProperty({ description: '子任务Id' })
    id?: number

    @IsNotEmpty()
    @ApiProperty({ description: '基础信息', type: () => SubDto })
    @Type(() => SubDto)
    @ValidateNested({ each: true })
    sub: SubDto

    @IsNotEmpty()
    @ApiProperty({ description: '设备', type: () => [SubNetWorkDeviceDto] })
    @Type(() => SubNetWorkDeviceDto)
    @ValidateNested({ each: true })
    networks: SubNetWorkDeviceDto[]
}