import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { CompleteEntity } from '~/common/entity/common.entity'
import { FHoppingEntity } from './f-hopping'

@Entity('f_table')
export class FTableEntity  extends CompleteEntity{
  @Column('text', { name: 'alias' })
  alias: string

  @Column('text', { name: 'type' })
  type: string

  @Column('integer', { name: 'law_start' })
  law_start: number

  @Column('integer', { name: 'law_spaceing' })
  law_spaceing: number

  @Column('integer', { name: 'law_end' })
  law_end: number

  @OneToMany(() => FHoppingEntity, f_hopping => f_hopping.f_table)
  hoppings: Relation<FHoppingEntity[]>
}
