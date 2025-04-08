import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";

@Entity("t_sub_device")
export class SubDeviceEntity extends CompleteEntity {
  @ApiProperty({ description: '子任务-名称', example: "任务规划-子任务-名称" })
  @Column("text", { name: "name", comment: '任务规划-子任务-名称' })
  SN: string;

  @ApiProperty({ description: '子任务-开始生效日期', example: '2024-01-01' })
  @Column("text", { name: "startTIme", comment: '任务规划-子任务-开始生效日期' })
  MAC: string;

  @ApiProperty({ description: '子任务-结束生效日期', example: "2024-01-01" })
  @Column("text", { name: "endTime", comment: '任务规划-子任务-结束生效日期' })
  endTime: string;

  @ApiProperty({ description: '子任务-备注（非必填）', example: '任务规划-描述（非必填）', required: false })
  @Column("text", { name: "dscription", comment: '任务规划-子任务-描述', nullable: false })
  dscription: string;
}
