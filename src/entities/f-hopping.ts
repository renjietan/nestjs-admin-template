import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity, CompleteEntity } from '~/common/entity/common.entity'
import { UserEntity } from './user.entity'
import { FTableEntity } from './f-table'

@Entity({ name: 'f_hopping' })
export class FHoppingEntity extends CompleteEntity {
    // @Column('integer', { name: 'f_table_id' })
    // f_table_id: number
    @ManyToOne(() => FTableEntity, f_table => f_table.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'f_table_id' })
    f_table_id: number

    @ManyToOne(() => UserEntity, user => user.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    declare createBy: number

    @Column('integer', { name: 'value' })
    value: number
}
