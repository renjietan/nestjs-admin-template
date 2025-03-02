import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity, CompleteEntity } from '~/common/entity/common.entity'
import { UserEntity } from './user.entity'
import { FTableEntity } from './f-table'

@Entity({ name: 'f_hopping' })
export class FHoppingEntity extends CompleteEntity {
    // @Column('integer', { name: 'f_table_id' })
    @ManyToOne(() => FTableEntity)
    @JoinColumn({ name: 'f_table_id' })
    f_table: FTableEntity

    @Column('integer', { name: 'value' })
    value: number
}
