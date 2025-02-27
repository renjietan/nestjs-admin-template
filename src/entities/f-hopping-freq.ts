import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity, CompleteEntity } from '~/common/entity/common.entity'
import { UserEntity } from './user.entity'

@Entity({ name: 'f_hopping' })
export class HoppingFreq extends CompleteEntity {
    @Column('integer', { name: 'f_table_id' })
    f_hopping_table_id: number
  
    @Column('integer', { name: 'value' })
    value: number
}
