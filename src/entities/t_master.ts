import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { SubEntity } from "./t_sub";

@Entity("tp_master")
export class MasterEntity extends CompleteEntity {
  @IsNotEmpty()
  @ApiProperty({ description: '主任务-名称', example: "name" })
  @Column("varchar", { name: "name", comment: '任务规划-主任务-名称' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ description: '主任务-开始生效日期', example: "startTime" })
  @Column("varchar", { name: "startTime", comment: '任务规划-主任务-开始生效日期', length: 19 })
  startTime: string;

  @IsNotEmpty()
  @ApiProperty({ description: '主任务-结束生效日期', example: "2024-05-05 21:03:45" })
  @Column("varchar", { name: "endTime", comment: '任务规划-主任务-结束生效日期', length: 19 })
  endTime: string;

  @IsNotEmpty()
  @ApiProperty({ description: '主任务-地区', example: "region" })
  @Column("varchar", { name: "region", comment: '任务规划-主任务-地区' })
  region: string;

  @ApiProperty({ description: '主任务-描述', example: "dscription", required: false })
  @Column("varchar", { name: "dscription", nullable: true, comment: '任务规划-描述', })
  dscription: string;

  @ApiProperty({ description: '子任务集合: 新增主任务时不要填', example: "子任务集合: 新增主任务时不要填", required: false })
  @OneToMany(() => SubEntity, (d) => d.master)
  subs: SubEntity[]
}
