import { MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {  CompleteEntity } from "~/common/entity/common.entity";
import { DictItemEntity } from "./dict-item.entity";

@Entity("d_device")
export class DeviceEntity extends CompleteEntity {
  @Column("varchar", { name: "SN", comment: '设备类型' })
  SN: string;  

  @Column("varchar", { name: "alias", comment: '设备类型' })
  alias: string;  

  @ManyToOne(() => DictItemEntity, {
    nullable: false
  })
  @JoinColumn({
    name: 'device_type',
    referencedColumnName: 'value',
  })
  // @Column("text", { name: "device_type", comment: '设备类型:例如Handheld' })
  device_type: DictItemEntity;  

  @ManyToOne(() => DictItemEntity, {
    nullable: false
  })
  @JoinColumn({
    name: 'model',
    referencedColumnName: 'value',
  })
  // @Column("text", { name: "model", comment: '设备模型:例如PM200' })
  model: DictItemEntity;  

  @Column("int", { name: "orgId", comment: '组织机构', nullable: true })
  orgId: string;  

  @Column("varchar", { name: "remarks", comment: '备注', nullable: true })
  remarks: string;  

  @ManyToOne(() => DictItemEntity, {
    nullable: false,
  })
  @JoinColumn({
    name: 'status',
    referencedColumnName: 'value',
  })
  // @Column("text", { name: "status" })
  status: DictItemEntity;  
}
