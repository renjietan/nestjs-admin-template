import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { SubDeviceDto } from "~/modules/mission_planning/dto/mission_planning.dto";
import { IsUnique } from "~/shared/database/constraints/unique.constraint";
import { MasterEntity } from "./t_master";
import { SubDeviceEntity } from "./t_sub_device";

// 任务规划-子任务
@Entity("t_sub")
export class SubEntity extends CompleteEntity {
  @IsUnique({ entity: SubEntity, message: "index.Unique.DuplicateSubtaskName" })
  @IsNotEmpty()
  @ApiProperty({ description: "子任务名称", example: "子任务名称" })
  @Column("varchar", { name: "name", comment: "子任务名称" })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ description: "开始生效日期", example: "2024-01-01" })
  @Column("varchar", { name: "startTIme", comment: "开始生效日期", length: 19 })
  startTIme: string;

  @IsNotEmpty()
  @ApiProperty({ description: "结束生效日期", example: "2024-01-01" })
  @Column("varchar", { name: "endTime", comment: "结束生效日期", length: 19 })
  endTime: string;

  @ApiProperty({
    description: "备注（非必填）",
    example: "描述（非必填）",
    required: false,
  })
  @Column("varchar", { name: "dscription", comment: "描述", nullable: false })
  dscription: string;

  @ApiProperty({ description: "不用传", example: "不用传" })
  @ManyToOne(() => MasterEntity, (master) => master.subs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "mId" })
  master: MasterEntity;

  @OneToMany(() => SubDeviceEntity, (d) => d.sub, { cascade: true })
  devices: SubDeviceDto[];
}
