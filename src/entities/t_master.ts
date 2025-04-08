import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { IsUnique } from "~/shared/database/constraints/unique.constraint";
import { SubEntity } from "./t_sub";

//任务规划-主任务
@Entity("t_master")
export class MasterEntity extends CompleteEntity {
  @IsUnique({ entity: MasterEntity, message: "index.Unique.DuplicateTaskName" })
  @IsNotEmpty()
  @ApiProperty({ description: '任务名称', example: "name" })
  @Column("varchar", { name: "name", comment: '任务名称' })
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '开始生效日期', example: "2024-05-05 21:03:45" })
  @Column("varchar", { name: "startTime", comment: '开始生效日期', length: 19 })
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '结束生效日期', example: "2024-05-05 21:03:45" })
  @Column("varchar", { name: "endTime", comment: '结束生效日期', length: 19 })
  endTime: string;

  @IsNotEmpty()
  @ApiProperty({ description: '地区', example: "region" })
  @Column("varchar", { name: "region", comment: '地区' })
  region: string;

  @ApiProperty({ description: '描述', example: "dscription", required: false })
  @Column("varchar", { name: "dscription", nullable: true, comment: '描述', })
  dscription: string;

  @ApiProperty({ description: '子任务集合: 新增主任务时不要填', example: "子任务集合: 新增主任务时不要填", required: false })
  @OneToMany(() => SubEntity, (d) => d.master)
  subs: SubEntity[]
}
