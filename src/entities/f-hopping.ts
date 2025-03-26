import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { CompleteEntity } from '~/common/entity/common.entity'
import { FTableEntity } from './f-table'

@Entity({ name: 'f_hopping' })
export class FHoppingEntity extends CompleteEntity {
    @ApiProperty({ description: '关联的 f_table 的 id' })
    @ManyToOne(() => FTableEntity, (fTable) => fTable.hoppings, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'f_table_id' })
    f_table: FTableEntity

    @ApiProperty({ description: '值' })
    @Column('float', { name: 'value' })
    value: number
}
