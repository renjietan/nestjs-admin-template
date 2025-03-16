import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CompleteEntity } from '~/common/entity/common.entity'
import { DeviceEntity } from './d_device'
import { PMSubEntity } from './pm_sub'

@Entity('pm_sub_network_devices')
export class PMSubNetWorkDeviceEntity extends CompleteEntity {
  @Column('text', { name: 'ip_addr', comment: '任务规划-子任务-网关设备-IP地址' })
  ip_addr: string

  @Column('text', { name: 'network_addr', comment: '任务规划-子任务-网关设备-网关地址' })
  network_addr: string

  @Column('text', { name: 'private_conf', comment: '任务规划-子任务-网关设备-配置表' })
  private_conf: string

  @Column('integer', { name: 'isMaster', comment: '任务规划-子任务-网关设备-指定设备是否为master' })
  isMaster: number

  @ManyToOne(() => DeviceEntity, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'deviceId' })
  device: DeviceEntity

  @ManyToOne(() => PMSubEntity, (master) => master.networks,{ onDelete: "CASCADE" })
  @JoinColumn({ name: 'pm_sub_id' })
  pm_sub: PMSubEntity
}
