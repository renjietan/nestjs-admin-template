import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { IsUnique } from "~/shared/database/constraints/unique.constraint";
import { MasterEntity } from "./t_master";
import { SubDeviceEntity } from "./t_sub_device";
import { SubEncryptEntity } from "./t_sub_encrypt";
import { SubHopEntity } from "./t_sub_hop";
import { SubTimeSlotEntity } from "./t_sub_slot";

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
  master: Relation<MasterEntity>;

  @OneToMany(() => SubDeviceEntity, (d) => d.sub, { cascade: true })
  devices: Relation<SubDeviceEntity[]>;

  @OneToMany(() => SubHopEntity, (d) => d.sub, { cascade: true })
  hops: Relation<SubHopEntity[]>;

  @OneToMany(() => SubTimeSlotEntity, (d) => d.sub, { cascade: true })
  time_slots: Relation<SubTimeSlotEntity[]>;

  @OneToMany(() => SubEncryptEntity, (d) => d.sub, { cascade: true })
  encrypts: Relation<SubEncryptEntity[]>;
}
