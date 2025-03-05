import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity("d_device")
export class DeviceEntity extends CompleteEntity {
  @ApiProperty()
  @Column("varchar", { name: "SN", comment: '设备类型' })
  SN: string;

  @ApiProperty()
  @Column("varchar", { name: "alias", comment: '设备类型' })
  alias: string;

  @ApiProperty()
  @Column("varchar", { name: "device_type", comment: '设备类型:例如Handheld' })
  device_type: string;

  @ApiProperty()
  @Column("varchar", { name: "model", comment: '设备模型:例如PM200' })
  model: string;

  @ApiProperty()
  @Column("int", { name: "orgId", comment: '组织机构', nullable: true })
  orgId: string;

  @ApiProperty()
  @Column("varchar", { name: "remarks", comment: '备注', nullable: true })
  remarks: string;

  @ApiProperty({  })
  @Column("varchar", { name: "status" })
  status: string;
}
