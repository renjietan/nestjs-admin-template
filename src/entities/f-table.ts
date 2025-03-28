import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm'
import { CompleteEntity } from '~/common/entity/common.entity'
import { DictItemEntity } from './dict-item.entity'
import { FHoppingEntity } from './f-hopping'

@Entity('f_table')
export class FTableEntity  extends CompleteEntity{
  @ApiProperty({ description: '别名' })
  @Column("varchar", { name: 'alias' })
  alias: string

  @ApiProperty({ description: '类型', type: DictItemEntity })
  @ManyToOne(() => DictItemEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: "type", referencedColumnName: "value" })
  type: string

  @ApiProperty({ description: '最小数' })
  @Column('float', { name: 'law_start' })
  law_start: number

  @ApiProperty({ description: '间隔值' })
  @Column('float', { name: 'law_spaceing' })
  law_spacing: number

  @ApiProperty({ description: '最大数' })
  @Column('float', { name: 'law_end' })
  law_end: number

  @ApiProperty({ description: '别名' })
  @OneToMany(() => FHoppingEntity, hopping => hopping.f_table, {
    cascade: true, // 级联操作（自动保存子表）
  })
  hoppings?: Relation<FHoppingEntity[]>
}
