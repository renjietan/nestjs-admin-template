import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TodoEntity } from '../../entities/todo.entity'
import { TodoController } from './todo.controller'
import { TodoService } from './todo.service'

const services = [TodoService]

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodoController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class TodoModule {}
