import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ETableDetailEntity } from "./e_table_detail";
import { CompleteEntity } from "~/common/entity/common.entity";
import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { DictItemEntity } from "./dict-item.entity";

@Entity("e_table")
export class ETableEntity extends CompleteEntity {
  @ApiProperty()
  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @ApiProperty()
  @Column("varchar", { name: "startDate", comment: '生效开始日期' })
  startDate: string;

  @ApiProperty()
  @Column("integer", { name: "days", comment: '生效天数', default: 0 })
  days: number;

  @ApiProperty()
  @Column("varchar", { name: "waveType", comment: '波形类型: MR9530(11-500), MR9560(16)' })
  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'waveType', referencedColumnName: 'value' })
  waveType: DictItemEntity;

  @ApiProperty()
  @OneToMany(() => ETableDetailEntity, (e_table_encrypt) => e_table_encrypt.tableId)
  details: ETableDetailEntity[];
}
