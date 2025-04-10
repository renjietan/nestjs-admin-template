import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { MasterEntity } from "~/entities/t_master";
import { SubEntity } from "~/entities/t_sub";
import { SubDeviceEntity } from "~/entities/t_sub_device";
import { SubEncryptEntity } from "~/entities/t_sub_encrypt";
import { SubHopEntity } from "~/entities/t_sub_hop";
import { SubTimeSlotEntity } from "~/entities/t_sub_slot";

export class MasterDto extends PartialType(
  OmitType(MasterEntity, ["id", "createdAt", "updatedAt", "createBy", "updateBy", "subs"] as const)
) {}

export class SubDto extends PartialType(
  OmitType(SubEntity, [
    "id",
    "createdAt",
    "updatedAt",
    "createBy", 
    "updateBy", 
    "master",
    "devices",
    "hops",
    "time_slots",
    "encrypts"
  ] as const)
) {
  // 采用以上 OmitType 无法 在DTO中 进行  数组子元素验证
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SubDeviceDto)
  @ApiProperty({ description: "设备", type: () => [SubDeviceDto] })
  devices: SubDeviceDto[];

  // 采用以上 OmitType 无法 在DTO中 进行  数组子元素验证
  @ValidateNested({ each: true })
  @Type(() => SubHopDto)
  @ApiProperty({ description: "设备", type: () => [SubHopDto] })
  hops?: SubHopDto[];

  // 采用以上 OmitType 无法 在DTO中 进行  数组子元素验证
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SubTimeSlotDto)
  @ApiProperty({ description: "设备", type: () => [SubTimeSlotDto] })
  time_slots?: SubTimeSlotDto[];

  // 采用以上 OmitType 无法 在DTO中 进行  数组子元素验证
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SubEncryptDto)
  @ApiProperty({ description: "密钥表", type: () => [SubEncryptDto] })
  encrypts?: SubEncryptDto[];
}

/* ============================= 网络设备  ================================= */
export class SubDeviceDto extends PartialType(OmitType(SubDeviceEntity, ["id", "createdAt", "updatedAt", "sub"] as const)) {}

/* ============================= 跳频表  ================================= */
export class SubHopDto extends PartialType(OmitType(SubHopEntity, ["id","createdAt", "updatedAt", "createBy", "updateBy",  "points", "sub" ])) {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({ description: "频点集合", example: [1,2,3] })
  points: number[]
}

export class SubHopUpdateDto extends PartialType(SubHopDto) {}

/* ============================= 时隙表  ================================= */
export class SubTimeSlotDto extends PartialType(OmitType(SubTimeSlotEntity, ["id", "createdAt", "updatedAt", "createBy", "updateBy",  "points", "sub"] as const)) {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({ description: "点 集合", example: [1,2,3] })
  points: number[]
}

/* ============================= 密钥表  ================================= */
export class SubEncryptDto extends PartialType(OmitType(SubEncryptEntity, ["id", "createdAt", "updatedAt", "createBy", "updateBy",  "points", "sub"] as const)) {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: "密钥集合", example: [1,2,3] })
  points: string[]
}
