import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity, CompleteEntity } from '~/common/entity/common.entity'
import { UserEntity } from './user.entity'
import { FTableEntity } from './f-table'

@Entity({ name: 'f_hopping' })
export class FHoppingEntity extends CompleteEntity {
    @ApiProperty({ description: '关联的 f_table 的 id' })
    @ManyToOne(() => FTableEntity, (fTable) => fTable.hoppings, {
        onDelete: 'CASCADE', // 父表删除时级联删除子表
    })
    @JoinColumn({ name: 'f_table_id' })
    f_table: FTableEntity

    @ApiProperty({ description: '值' })
    @Column('integer', { name: 'value' })
    value: number
}
