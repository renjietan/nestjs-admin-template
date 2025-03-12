import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";

@Entity("pm_master")
export class PMMasterEntity extends CompleteEntity {
  @ApiProperty({ description: '任务规划名称' })
  @Column("text", { name: "pm_name", comment: '任务规划名称' })
  pm_name: string;

  @ApiProperty({ description: '任务规划-开始生效日期' })
  @Column("text", { name: "pm_startTime", comment: '任务规划-开始生效日期' })
  pm_startTime: string;

  @ApiProperty({ description: '任务规划-结束生效日期' })
  @Column("text", { name: "pm_endTime", comment: '任务规划-结束生效日期' })
  pm_endTime: string;

  @ApiProperty({ description: '任务规划-组织机构ID' })
  @Column("integer", { name: "pm_orgId", comment: '任务规划-组织机构ID' })
  pm_orgId: number;

  @ApiProperty({ description: '任务规划-备注' })
  @Column("text", { name: "pm_Desc", nullable: true, comment: '任务规划-备注', })
  pm_Desc: string;
}
