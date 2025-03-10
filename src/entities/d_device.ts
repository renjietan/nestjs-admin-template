import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { ApiProperty } from '@nestjs/swagger';
import { DictItemEntity } from "./dict-item.entity";

@Entity("d_device")
export class DeviceEntity extends CompleteEntity {
  @ApiProperty()
  @Column("varchar", { name: "SN", comment: '设备类型' })
  SN: string;

  @ApiProperty()
  @Column("varchar", { name: "alias", comment: '设备类型' })
  alias: string;

  @ApiProperty()
  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'device_type' })
  device_type: DictItemEntity;

  @ApiProperty()
  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'model' })
  model: DictItemEntity;

  @ApiProperty()
  @Column("int", { name: "orgId", comment: '组织机构', nullable: true })
  orgId: string;

  @ApiProperty()
  @Column("varchar", { name: "remarks", comment: '备注', nullable: true })
  remarks: string;

  @ApiProperty()
  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'status', referencedColumnName: 'value' })
  status: DictItemEntity;
}
