import { Column, Entity, OneToMany } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { PMSubEntity } from "./pm_sub";

@Entity("pm_master")
export class PMMasterEntity extends CompleteEntity {

  @Column("text", { name: "pm_name", comment: '任务规划名称' })
  pm_name: string;

  @Column("text", { name: "pm_startTime", comment: '任务规划-开始生效日期' })
  pm_startTime: string;

  @Column("text", { name: "pm_endTime", comment: '任务规划-结束生效日期' })
  pm_endTime: string;

  @Column("integer", { name: "pm_orgId", comment: '任务规划-组织机构ID' })
  pm_orgId: number;

  @Column("text", { name: "pm_Desc", nullable: true, comment: '任务规划-备注', })
  pm_Desc: string;

  @OneToMany(() => PMSubEntity, (d) => d.pm_master)
  subs: PMSubEntity[]
}
