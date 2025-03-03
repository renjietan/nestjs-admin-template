import { MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { DictItemEntity } from "./dict-item.entity";

@Entity("d_device")
export class DeviceEntity extends CompleteEntity {
  @Column("varchar", { name: "SN", comment: '设备类型' })
  SN: string;

  @Column("varchar", { name: "alias", comment: '设备类型' })
  alias: string;

  @Column("varchar", { name: "device_type", comment: '设备类型:例如Handheld' })
  device_type: string;

  @Column("varchar", { name: "model", comment: '设备模型:例如PM200' })
  model: string;

  @Column("int", { name: "orgId", comment: '组织机构', nullable: true })
  orgId: string;

  @Column("varchar", { name: "remarks", comment: '备注', nullable: true })
  remarks: string;

  // @ManyToOne(() => DictItemEntity, { createForeignKeyConstraints: false, eager: true, cascade: true })
  // @JoinColumn({
  //   name: 'status',
  //   referencedColumnName: 'value',
  //   foreignKeyConstraintName: 'FK_STATUS_DICTITEM'
  // })
  @Column("varchar", { name: "status" })
  status: string;
}
