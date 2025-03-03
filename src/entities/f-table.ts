import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { CompleteEntity } from '~/common/entity/common.entity'
import { FHoppingEntity } from './f-hopping'
import { ApiProperty } from '@nestjs/swagger'

@Entity('f_table')
export class FTableEntity  extends CompleteEntity{
  @ApiProperty({ description: '别名' })
  @Column("varchar", { name: 'alias' })
  alias: string

  @ApiProperty({ description: '类型' })
  @Column('varchar', { name: 'type' })
  type: string

  @ApiProperty({ description: '最小数' })
  @Column('integer', { name: 'law_start' })
  law_start: number

  @ApiProperty({ description: '间隔值' })
  @Column('integer', { name: 'law_spaceing' })
  law_spaceing: number

  @ApiProperty({ description: '最大数' })
  @Column('integer', { name: 'law_end' })
  law_end: number

  @ApiProperty({ description: '别名' })
  @OneToMany(() => FHoppingEntity, hopping => hopping.f_table, {
    cascade: true, // 级联操作（自动保存子表）
  })
  hoppings: Relation<FHoppingEntity[]>
}
