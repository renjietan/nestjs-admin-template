import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SseService } from '~/modules/sse/sse.service'

import { RoleEntity } from '../../../entities/role.entity'

import { MenuModule } from '../menu/menu.module'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

const providers = [RoleService, SseService]

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]),
    forwardRef(() => MenuModule),
  ],
  controllers: [RoleController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class RoleModule {}
