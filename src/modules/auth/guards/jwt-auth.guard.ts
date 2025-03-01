import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import Redis from 'ioredis'
import { isEmpty, isNil } from 'lodash'
import { ExtractJwt } from 'passport-jwt'

import { InjectRedis } from '~/common/decorators/inject-redis.decorator'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { AppConfig, IAppConfig, RouterWhiteList } from '~/config'
import { ErrorEnum } from '~/constants/error-code.constant'
import { genTokenBlacklistKey } from '~/helper/genRedisKey'

import { AuthService } from '~/modules/auth/auth.service'

import { checkIsDemoMode } from '~/utils'

import { AuthStrategy, PUBLIC_KEY } from '../auth.constant'
import { TokenService } from '../services/token.service'
import { env } from '~/global/env'

/** @type {import('fastify').RequestGenericInterface} */
interface RequestType {
  Params: {
    uid?: string
  }
  Querystring: {
    token?: string
  }
}

// https://docs.nestjs.com/recipes/passport#implement-protected-route-and-jwt-strategy-guards
@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken()

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private tokenService: TokenService,
    @InjectRedis() private readonly redis: Redis,
    @Inject(AppConfig.KEY) private appConfig: IAppConfig,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest<FastifyRequest<RequestType>>()

    // const response = context.switchToHttp().getResponse<FastifyReply>()
    if (RouterWhiteList.includes(request.routeOptions.url))
      return true
    // TODO 此处代码的作用是判断如果在演示环境下，则拒绝用户的增删改操作，去掉此代码不影响正常的业务逻辑
    if (request.method !== 'GET' && !request.url.includes('/auth/login'))
      checkIsDemoMode()

    const isSse = request.headers.accept === 'text/event-stream'

    if (isSse && !request.headers.authorization?.startsWith('Bearer ')) {
      const { token } = request.query
      if (token)
        request.headers.authorization = `Bearer ${token}`
    }

    const token = this.jwtFromRequestFn(request)

    // 检查 token 是否在黑名单中
    if (await this.redis.get(genTokenBlacklistKey(token))) {
      console.log('JwtAuthGuard1 token in black===========', token);
      throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    }


    request.accessToken = token

    let result: any = false
    try {
      result = await super.canActivate(context)
    }
    catch (err) {
      // 需要后置判断 这样携带了 token 的用户就能够解析到 request.user
      let env_public = env('IS_PUBLIC')
      if (isPublic || env_public)
        return true

      if (isEmpty(token)) {
        console.log('JwtAuthGuard2 no login===========', token);
        throw new UnauthorizedException(ErrorEnum.NO_LOGIN)
      }

      // 在 handleRequest 中 user 为 null 时会抛出 UnauthorizedException
      if (err instanceof UnauthorizedException) {
        console.log('JwtAuthGuard 3 user is null===========', err);
        throw new BusinessException(ErrorEnum.INVALID_LOGIN)
      }

      // 判断 token 是否有效且存在, 如果不存在则认证失败
      const isValid = isNil(token)
        ? undefined
        : await this.tokenService.checkAccessToken(token!)

      if (!isValid)
        console.log('JwtAuthGuard 4 token valid===========', token);
      throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    }

    // SSE 请求
    if (isSse) {
      const { uid } = request.params
      // JWT权限  打印
      // console.log('uid==============', uid);
      // console.log('request.user==============', request.user.uid);
      // console.log(Object.prototype.toString.call(uid));
      // console.log(Object.prototype.toString.call(request.user.uid));
      // console.log(Number(uid) !== request.user.uid);
      
      if (Number(uid) !== request.user.uid) {
        console.log('JwtAuthGuard 5 ===========', "路径参数 uid 与当前 token 登录的用户 uid 不一致");
        throw new UnauthorizedException('The parameter uId does not match the uId of the currently logged-in user.')
      }
    }

    const pv = await this.authService.getPasswordVersionByUid(request.user.uid)
    if (pv !== `${request.user.pv}`) {
      // 密码版本不一致，登录期间已更改过密码
      console.log('JwtAuthGuard 6 ===========', "密码版本不一致，登录期间已更改过密码");
      throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    }

    // 不允许多端登录
    if (!this.appConfig.multiDeviceLogin) {
      const cacheToken = await this.authService.getTokenByUid(request.user.uid)

      if (token !== cacheToken) {
        // 与redis保存不一致 即二次登录
        console.log('JwtAuthGuard 7 ===========', "与redis保存不一致 即二次登录");
        throw new BusinessException(ErrorEnum.ACCOUNT_LOGGED_IN_ELSEWHERE)
      }
    }

    return result
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user)
      throw err || new UnauthorizedException()

    return user
  }
}
