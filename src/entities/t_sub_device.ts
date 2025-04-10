import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsIP, IsNotEmpty, IsNumber, IsObject } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Exact } from "~/common/dto/pager.dto";
import { CompleteEntity } from "~/common/entity/common.entity";
import { SubEntity } from "./t_sub";

@Entity("t_sub_device")
export class SubDeviceEntity extends CompleteEntity {
  @IsNotEmpty()
  @ApiProperty({ description: 'SN', example: "SN001" })
  @Column("varchar", { name: "SN", comment: '设备SN号' })
  SN: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: '设备Mac地址', example: 1 })
  @Column("int", { name: "MAC", comment: '设备Mac地址' })
  MAC: number;
  
  @IsNotEmpty()
  @IsIP()
  @ApiProperty({ description: '设备IP地址', example: "192.168.0.13" })
  @Column("varchar", { name: "IP", comment: '设备IP地址' })
  IP: string;

  @IsNotEmpty()
  @IsIP()
  @ApiProperty({ description: '设备网关地址', example: '255.255.255.0' })
  @Column("varchar", { name: "dscription", comment: '设备网关地址' })
  gatewayIP: string;

  @IsNotEmpty()
  @IsEnum(Exact)
  @ApiProperty({ description: '设备网关地址', example: 1, enum: Exact })
  @Column("tinyint", { name: "isMaster", comment: '是否是主台', nullable: false, default: 1 })
  isMaster: number

  @ApiProperty({ description: '设备对应的配置', example: {}})
  @IsNotEmpty()
  @IsObject()
  @Column("simple-json", { name: "conf", comment: '设备对应的配置', })
  conf: {};

  @ManyToOne(() => SubEntity, (sub) => sub.devices, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'subId' })
  sub: SubEntity
}
