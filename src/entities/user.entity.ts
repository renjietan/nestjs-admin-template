import { Exclude } from 'class-transformer'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Relation
} from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

import { AccessTokenEntity } from './access-token.entity'
import { DictItemEntity } from './dict-item.entity'
import { RoleEntity } from './role.entity'

@Entity({ name: 'sys_user' })
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  username: string

  @Exclude()
  @Column()
  password: string

  @Column({ length: 32 })
  psalt: string

  @Column({ nullable: true })
  nickname: string

  @Column({ nullable: true })
  remark: string

  @Column({ type: 'tinyint', nullable: true, default: 1 })
  status: number

  
  @ManyToMany(() => RoleEntity, role => role.users, {
    // ! 由于前端 不使用  路由以及权限接口， 所以这里，不强制关联
    createForeignKeyConstraints: false
  })
  @JoinTable({
    name: 'sys_user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id', },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Relation<RoleEntity[]>

  @ManyToOne(() => DictItemEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'role_id', referencedColumnName: "value"})
  role: DictItemEntity

  @OneToMany(() => AccessTokenEntity, accessToken => accessToken.user, {
    cascade: true,
  })
  accessTokens: Relation<AccessTokenEntity[]>
}
