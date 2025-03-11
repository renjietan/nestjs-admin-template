import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CompleteEntity } from '~/common/entity/common.entity'
import { DictItemEntity } from './dict-item.entity'

@Entity('n_network_template')
export class NNetWorkTemplateEntity extends CompleteEntity {
  @Column('text', { name: 'name', comment: '文件夹名称或网络模板名称' })
  name: string

  @Column('text', { name: 'other_conf', comment: '其他参数-JSON字符串, 根据配置表参数不同', nullable: true })
  other_conf: string

  @Column('text', { name: 'h_table_id', comment: '调频表ID  逗号分隔的字符串', nullable: true })
  h_table_ids: string

  @Column('integer', { name: 'type', default: 1, comment: '1-文件夹类型; 2-网络模板类型' })
  type: number

  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false,})
  @JoinColumn({ name: 'device_type',referencedColumnName: 'value'})
  device_type: DictItemEntity

  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false,})
  @JoinColumn({ name: 'access_method',referencedColumnName: 'value'})
  access_method: DictItemEntity

  @ManyToOne(() => DictItemEntity, { cascade: true, createForeignKeyConstraints: false,})
  @JoinColumn({ name: 'waveForm',referencedColumnName: 'value'})
  waveForm: DictItemEntity

  @Column('text', { name: 'ts_ids', comment: '时序表ID  逗号分隔', nullable: true })
  ts_ids: string

  @Column('integer', { name: 'pId', comment: '父ID', default: 0 })
  pId: number
}
