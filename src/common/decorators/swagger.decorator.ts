import { applyDecorators } from '@nestjs/common'
import { ApiSecurity } from '@nestjs/swagger'

export const API_SECURITY_AUTH = 'auth'

/**
 * 作用是在 Swagger/OpenAPI 文档中标记某个类或方法需要安全认证
 * 例如:  @ApiSecurity('auth')
 */
export function ApiSecurityAuth(): ClassDecorator & MethodDecorator {
  /*
    applyDecorators: NestJS 提供的一个工具函数，用于将多个装饰器合并为一个装饰器。
    ApiSecurity: @nestjs/swagger 提供的一个装饰器，用于在 Swagger/OpenAPI 文档中标记某个类或方法需要特定的安全认证
  */
  return applyDecorators(ApiSecurity(API_SECURITY_AUTH))
}
