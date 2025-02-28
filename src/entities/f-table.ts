import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CompleteEntity } from '~/common/entity/common.entity'

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
}
