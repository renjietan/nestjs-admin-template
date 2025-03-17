import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { PMMasterEntity } from "./pm_master";
import { PMSubNetWorkDeviceEntity } from "./pm_sub_network_device";

@Entity("pm_sub")
export class PMSubEntity extends CompleteEntity {
  @ApiProperty({ description: '任务规划-子任务-名称', example: "任务规划-子任务-名称" })
  @Column("text", { name: "pm_sub_name", comment: '任务规划-子任务-名称' })
  pm_sub_name: string;

  @ApiProperty({ description: '任务规划-子任务-开始生效日期', example: '2024-01-01' })
  @Column("text", { name: "pm_sub_startTime", comment: '任务规划-子任务-开始生效日期' })
  pm_sub_startTime: string;

  @ApiProperty({ description: '任务规划-子任务-结束生效日期', example: "2024-01-01" })
  @Column("text", { name: "pm_sub_endTime", comment: '任务规划-子任务-结束生效日期' })
  pm_sub_endTime: string;

  @ApiProperty({ description: '任务规划-备注', example: '任务规划-备注' })
  @Column("text", { name: "pm_Desc", comment: '任务规划-备注' })
  pm_sub_desc: string;

  @ApiProperty({ description: '任务目标', type: () => PMMasterEntity })
  @Type(() => PMMasterEntity)
  @ValidateNested({ each: true })
  @ManyToOne(() => PMMasterEntity, (master) => master.subs)
  @JoinColumn({ name: 'pm_master_id' })
  pm_master: PMMasterEntity

  @ApiProperty({ description: '子任务规划-network device列表', type: () => [PMSubNetWorkDeviceEntity] })
  @Type(() => PMSubNetWorkDeviceEntity)
  @ValidateNested({ each: true })
  @OneToMany(() => PMSubNetWorkDeviceEntity, (d) => d.pm_sub)
  networks: PMSubNetWorkDeviceEntity[]
}
