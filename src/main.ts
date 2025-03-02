import type { ConfigKeyPaths } from './config'
import cluster from 'node:cluster'

import path from 'node:path'
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { NestFastifyApplication } from '@nestjs/platform-fastify'

import { useContainer } from 'class-validator'

import { AppModule } from './app.module'
import { fastifyApp } from './common/adapters/fastify.adapter'
import { RedisIoAdapter } from './common/adapters/socket.adapter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { isDev, isMainProcess } from './global/env'
import { setupSwagger } from './setup-swagger'
import { LoggerService } from './shared/logger/logger.service'
import { deepFindValidateError } from './utils'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true,
      // forceCloseConnections: true,
    },
  )

  const configService = app.get(ConfigService<ConfigKeyPaths>)

  const { port, globalPrefix } = configService.get('app', { infer: true })

  // class-validator 的 DTO 类中注入 nest 容器的依赖 (用于自定义验证器)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.enableCors({ origin: '*', credentials: true })
  app.setGlobalPrefix(globalPrefix)
  app.useStaticAssets({ root: path.join(__dirname, '..', 'public') })
  // Starts listening for shutdown hooks
  !isDev && app.enableShutdownHooks()

  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor())
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //通过网络传入的有效负载是纯 JavaScript 对象。可以 ValidationPipe 自动将请求参数转为对应的 DTO 对象。要启动自动转换，只要设置transform属性为 true 即可。具体的代码如下：
      enableDebugMessages: true,  //如果设置为 true，当出现问题时，验证器将向控制台打印额外的警告消息
      whitelist: true, // 如果设置为 true，验证器将删除已验证（返回）对象的任何不使用任何验证装饰器的属性 
      transformOptions: { enableImplicitConversion: true },
      // forbidNonWhitelisted: true, // 禁止 无装饰器验证的数据通过
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      stopAtFirstError: true,
      exceptionFactory: errors => {
        console.log('ValidationPipe errors==============', errors);
        let _errors = deepFindValidateError(errors)
        return new UnprocessableEntityException(
          _errors![0]
          // errors.map((e) => {
          //   console.log('ValidationPipe msg=========', e);
          //   const rule = Object.keys(e.constraints!)[0]
          //   const msg = e.constraints![rule]
          //   console.log('ValidationPipe msg=========', msg);
          //   return msg
          // })[0],
        )
      },
    }),
  )

  app.useWebSocketAdapter(new RedisIoAdapter(app))

  setupSwagger(app, configService)

  await app.listen(port, '0.0.0.0', async () => {
    app.useLogger(app.get(LoggerService))
    const url = await app.getUrl()
    const { pid } = process
    const env = cluster.isPrimary
    const prefix = env ? 'P' : 'W'

    if (!isMainProcess)
      return

    const logger = new Logger('NestApplication')
    logger.log(`[${prefix + pid}] Server running on ${url}`)

    if (isDev)
      logger.log(`[${prefix + pid}] OpenAPI: ${url}/api-docs`)
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
