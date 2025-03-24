import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
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
  @Column("int", { name: "orgId", comment: '组织机构', nullable: true })
  orgId: string;

  @ApiProperty()
  @Column("varchar", { name: "remarks", comment: '备注', nullable: true })
  remarks: string;

  @ApiProperty({ description: '类型', type: DictItemEntity })
  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'device_type', referencedColumnName: 'value' })
  device_type: DictItemEntity;

  @ApiProperty({ description: '型号', type: DictItemEntity })
  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false, })
  @JoinColumn({ name: 'model', referencedColumnName: 'value' })
  model: DictItemEntity;

  @ApiProperty({ description: '状态', type: DictItemEntity })
  @ManyToOne(() => DictItemEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: "status", referencedColumnName: "value" })
  status: DictItemEntity;
}
