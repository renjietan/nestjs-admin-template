import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { MasterEntity } from "~/entities/t_master";
import { SubEntity } from "~/entities/t_sub";
import { SubDeviceEntity } from "~/entities/t_sub_device";

export class MasterDto extends PartialType(
  OmitType(MasterEntity, ["id", "createdAt", "updatedAt", "subs"] as const)
) {}

export class SubDto extends PartialType(
  OmitType(SubEntity, [
    "id",
    "createdAt",
    "updatedAt",
    "master",
    "devices",
  ] as const)
) {
  // 采用以上 OmitType 无法 在DTO中 进行  数组子元素验证
  @ValidateNested({ each: true })
  @Type(() => SubDeviceDto)
  @ApiProperty({ description: "设备", type: () => [SubDeviceDto] })
  devices?: SubDeviceDto[];
}

export class SubDeviceDto extends PartialType(
  OmitType(SubDeviceEntity, ["id", "createdAt", "updatedAt", "sub"] as const)
) {}
