import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PMSubEntity } from './pm_sub'
import { DeviceEntity } from './d_device'
import { ApiProperty } from '@nestjs/swagger'
import { CompleteEntity } from '~/common/entity/common.entity'

@Entity('pm_sub_network_devices')
export class PMSubNetWorkDeviceEntity extends CompleteEntity {
  @ApiProperty({ description: '任务规划-子任务-网关设备-IP地址' })
  @Column('text', { name: 'ip_addr', comment: '任务规划-子任务-网关设备-IP地址' })
  ip_addr: string

  @ApiProperty({ description: '任务规划-子任务-网关设备-网关地址' })
  @Column('text', { name: 'network_addr', comment: '任务规划-子任务-网关设备-网关地址' })
  network_addr: string

  @ApiProperty({ description: '任务规划-子任务-网关设备-配置表' })
  @Column('text', { name: 'private_conf', comment: '任务规划-子任务-网关设备-配置表' })
  private_conf: string

  @ApiProperty({ description: '任务规划-子任务-网关设备-指定设备是否为master' })
  @Column('integer', { name: 'isMaster', comment: '任务规划-子任务-网关设备-指定设备是否为master' })
  isMaster: number

  @ApiProperty({ description: '设备' })
  @ManyToOne(() => DeviceEntity, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'deviceId' })
  device: DeviceEntity

  @ApiProperty()
  // 定义多对一关系（子表 -> 父表）
  @ManyToOne(() => PMSubEntity, pmSub => pmSub.networkDevices)
  @JoinColumn({ name: 'pm_sub_id' })
  pmSub: PMSubEntity
}
