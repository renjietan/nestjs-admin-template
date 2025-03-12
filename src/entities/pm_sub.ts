import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PMSubNetWorkDeviceEntity } from "./pm_sub_network_device";
import { CompleteEntity } from "~/common/entity/common.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("pm_sub")
export class PMSubEntity extends CompleteEntity {
  @ApiProperty({ description: '任务规划-子任务-名称' })
  @Column("text", { name: "pm_sub_name", comment: '任务规划-子任务-名称' })
  pm_sub_name: string;

  @ApiProperty({ description: '任务规划-子任务-开始生效日期' })
  @Column("text", { name: "pm_sub_startTime", comment: '任务规划-子任务-开始生效日期' })
  pm_sub_startTime: string;

  @ApiProperty({ description: '任务规划-子任务-结束生效日期' })
  @Column("text", { name: "pm_sub_endTime", comment: '任务规划-子任务-结束生效日期' })
  pm_sub_endTime: string;

  @OneToMany(() => PMSubNetWorkDeviceEntity, (device) => device.pmSub)
  networkDevices: PMSubNetWorkDeviceEntity[];

  @ApiProperty({ description: '任务规划-备注' })
  @Column("text", { name: "pm_Desc", comment: '任务规划-备注' })
  pm_sub_Desc: string;
}
