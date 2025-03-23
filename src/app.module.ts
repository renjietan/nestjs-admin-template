import type { FastifyRequest } from 'fastify'

import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ClsModule } from 'nestjs-cls'

import config from '~/config'
import { SharedModule } from '~/shared/shared.module'

import { AllExceptionsFilter } from './common/filters/any-exception.filter'

import { IdempotenceInterceptor } from './common/interceptors/idempotence.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AuthModule } from './modules/auth/auth.module'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RbacGuard } from './modules/auth/guards/rbac.guard'
import { HealthModule } from './modules/health/health.module'
import { SseModule } from './modules/sse/sse.module'
import { SystemModule } from './modules/system/system.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { TestModule } from './modules/test/test.module'
import { ToolsModule } from './modules/tools/tools.module'

import { ThrottlerGuard } from '@nestjs/throttler'
import { DeviceModule } from './modules/device/device.module'
import { ETableModule } from './modules/e_table/e_table.module'
import { ETableDetailModule } from './modules/e_table_detail/e_table_detail.module'
import { HopFreqModule } from './modules/hop-freq/hop-freq.module'
import { NetworkTemplateModule } from './modules/network-template/network-template.module'
import { PShotMessageModule } from './modules/p_shot_message/p_shot_message.module'
import { PmMasterModule } from './modules/pm-master/pm-master.module'
import { PmSubModule } from './modules/pm-sub/pm-sub.module'
import { WaveDeviceConfigModule } from './modules/wave_device_config/wave_device_config.module'
import { DatabaseModule } from './shared/database/database.module'
import { SocketModule } from './socket/socket.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    // 启用 CLS 上下文
    ClsModule.forRoot({
      global: true,
      // https://github.com/Papooch/nestjs-cls/issues/92
      interceptor: {
        mount: true,
        setup: (cls, context) => {
          const req = context.switchToHttp().getRequest<FastifyRequest<{ Params: { id?: string } }>>()
          if (req.params?.id && req.body) {
            // 供自定义参数验证器(UniqueConstraint)使用
            cls.set('operateId', Number.parseInt(req.params.id))
          }
        },
      },
    }),
    SharedModule,
    // 数据库
    DatabaseModule,

    TestModule,
    AuthModule,
    SystemModule,
    TasksModule.forRoot(),
    ToolsModule,
    SocketModule,
    HealthModule,
    SseModule,
    HopFreqModule,
    DeviceModule,
    ETableModule,
    ETableDetailModule,
    NetworkTemplateModule,
    PShotMessageModule,
    PmMasterModule,
    PmSubModule,
    WaveDeviceConfigModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }, // 统一处理接口请求与响应结果
    { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) }, // 接口超时
    { provide: APP_INTERCEPTOR, useClass: IdempotenceInterceptor },

    { provide: APP_GUARD, useClass: JwtAuthGuard }, // JWT TOKEN权限验证
    { provide: APP_GUARD, useClass: RbacGuard },  // 接口权限
    { provide: APP_GUARD, useClass: ThrottlerGuard }, // 接口限流;参考：https://gitcode.com/gh_mirrors/th/throttler
  ],
})
export class AppModule {}
