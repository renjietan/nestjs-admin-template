import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { MasterEntity } from "./t_master";

// 任务规划-子任务
@Entity("t_sub")
export class SubEntity extends CompleteEntity {
  @IsNotEmpty()
  @ApiProperty({ description: '子任务名称', example: "子任务名称" })
  @Column("varchar", { name: "name", comment: '子任务名称' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ description: '开始生效日期', example: '2024-01-01' })
  @Column("varchar", { name: "startTIme", comment: '开始生效日期', length: 19 })
  startTIme: string;

  @IsNotEmpty()
  @ApiProperty({ description: '结束生效日期', example: "2024-01-01" })
  @Column("varchar", { name: "endTime", comment: '结束生效日期', length: 19 })
  endTime: string;

  @ApiProperty({ description: '备注（非必填）', example: '描述（非必填）', required: false })
  @Column("varchar", { name: "dscription", comment: '描述', nullable: false })
  dscription: string;

  @ApiProperty({ description: '不用传', example: "不用传" })
  @Type(() => MasterEntity)
  @ValidateNested({ each: true })
  @ManyToOne(() => MasterEntity, (master) => master.subs)
  @JoinColumn({ name: 'mId' })
  master: MasterEntity
}
