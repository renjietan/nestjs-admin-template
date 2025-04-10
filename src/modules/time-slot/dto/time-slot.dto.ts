import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TimeSlotEntity } from "~/entities/time-slot";
import { IsUnique } from "~/shared/database/constraints/unique.constraint";

export class TimeSlotDto extends PartialType(OmitType(TimeSlotEntity, ["createdAt", "updatedAt", "points", "name" ])) {
    @IsUnique(TimeSlotEntity, { message: "index.Unique.TableNameExists" })
    @IsNotEmpty()
    @ApiProperty({ description: "名称", example: "名称" })
    name: string

    @IsOptional()
    @IsString({ each: true })
    @ApiProperty({ description: "值集合", example: ["可传可不传", "可传可不传", "可传可不传"] })
    points?: string[];
}
