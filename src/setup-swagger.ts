import { INestApplication, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { API_SECURITY_AUTH } from "./common/decorators/swagger.decorator";
import { CommonEntity } from "./common/entity/common.entity";
import { ResOp, TreeResult } from "./common/model/response.model";
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from "./config";
import { Pagination } from "./helper/paginate/pagination";

enum LanguageEnum {
  EN ="en",
  ZH_CN = "zh-CN"
}


export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>
): void {
  const { name, port } = configService.get<IAppConfig>("app")!;
  const { enable, path } = configService.get<ISwaggerConfig>("swagger")!;

  if (!enable) return;

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name} API document`)
    .setVersion("1.0");

  // auth security
  documentBuilder.addSecurity(API_SECURITY_AUTH, {
    description: "Enter the token",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  documentBuilder.addGlobalParameters({
    name: "x-lang",
    description: "语言环境标识",
    in: "header",
    required: false,
    schema: {
      type: 'string',
      enum: ['en', 'zh'], // 定义允许的枚举值（Swagger 显示下拉框）
      example: 'en',
    },
  });

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
    extraModels: [CommonEntity, ResOp, Pagination, TreeResult],
  });

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录
    },
  });

  // started log
  const logger = new Logger("SwaggerModule");
  logger.log(`Document running on http://127.0.0.1:${port}/${path}`);
}
