import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { DictItemEntity } from "./dict-item.entity";
import { ETableEntity } from "./e_table";

@Entity("e_table_detail")
export class ETableDetailEntity extends CompleteEntity {
  @Column("integer", { name: "channelNo", comment: '第几个信道(注意:这里不是信道Id)', nullable: true, default: 1 })
  channelNo: number;

  @Column("varchar", { name: "encrypt_pwd", comment: '密钥', default: '111' })
  encrypt_pwd: string;

  @Column("varchar", { name: "startDate", comment: '生效开始日期' })
  startDate: string;

  @Column("integer", { name: "days", comment: '生效天数', default: 0 })
  days: number;

  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'waveType', referencedColumnName: 'value'})
  waveType: DictItemEntity;

  @ManyToOne(() => ETableEntity, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn({
    name: 'table_id'
  })
  table: ETableEntity;

  @Column("integer", { name: "isDelete", comment: '软删除-标识' })
  isDelete: number;
}