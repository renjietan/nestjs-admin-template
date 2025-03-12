import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DictItemEntity } from './dict-item.entity'
import { CompleteEntity } from '~/common/entity/common.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('wave_device_config')
export class WaveDeviceConfigEntity extends CompleteEntity {
  @ApiProperty({ description: '名称' })
  @Column('text', { name: 'name', comment: '名称' })
  name: string

  @ApiProperty({ description: '最小值' })
  @Column('text', { name: 'min_value', nullable: true, comment: '最小值' })
  min_value: string | null

  @ApiProperty({ description: '最大值' })
  @Column('text', { name: 'max_value', nullable: true, comment: '最大值' })
  max_value: string | null

  @ApiProperty({ description: '初始值' })
  @Column('text', { name: 'init_value', nullable: true, comment: '初始值' })
  init_value: string | null

  @ApiProperty({ description: '单位' })
  @Column('text', { name: 'unit', nullable: true, comment: '单位', })
  unit: string | null

  @ApiProperty({ description: '枚举值' })
  @Column('text', { name: 'group', nullable: true, comment: '枚举值' })
  group: string | null

  @ApiProperty({ description: '单位' })
  @Column('text', { name: 'step_value', nullable: true, comment: '单位', })
  step_value: string

  @ManyToOne(() => DictItemEntity, {
    cascade: true,
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    name: 'valueType',
    referencedColumnName: 'value',
  })
  valueType: string

  @ManyToOne(() => DictItemEntity, {
    cascade: true,
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    name: 'deviceModel',
    referencedColumnName: 'value',
  })
  deviceModel: string

  @ManyToOne(() => DictItemEntity, {
    cascade: true,
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    name: 'deviceType',
    referencedColumnName: 'value',
  })
  deviceType: string

  @ManyToOne(() => DictItemEntity, {
    cascade: true,
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    name: 'waveType',
    referencedColumnName: 'value',
  })
  waveType: string
}
