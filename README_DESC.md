<center>框架说明</center>

### 命令解释
```
"scripts": {
    - 1、postinstall 是 npm install 自带的钩子，在 npm install 之后，会立即进入postinstall的生命周期，
    - 2、此处命令，将在npm install 后自动运行 scripts/genEnvTypes文件, 读取所有的.env .env.development .env.production 文件，
    - 3、并生成全局的类型声明，并写入到 types/env.d.ts 文件中
    "postinstall": "npm run gen-env-types",

    - 删除 构建的 dist 文件
    "prebuild": "rimraf dist",

    - 打包: 将 TypeScript 代码编译为 JavaScript，并输出到 dist 目录
    "build": "nest build",

    - 开发环境中运行
    "dev": "npm run start",

    - 以 调试模式 运行 可设置断点
    "dev:debug": "npm run start:debug",

    - 以 REPL 运行: 交互式编程环境，允许开发者逐行输入代码并立即查看结果
    "repl": "npm run start -- --entryFile repl",

    - 执行命令前需要先安装ncc、chmod：npm i -g @vercel/ncc
    - 命令说明：
      - 使用 ncc 将项目打包成一个单独的文件，并输出到 out 目录。
      - -o out 指定输出目录为 out。
      - -m 表示启用最小化(minify)输出文件。
      - -t  表示启用 TypeScript 支持（如果项目使用 TypeScript）。
    "bundle": "rimraf out && npm run build && ncc build dist/main.js -o out -m -t && chmod +x out/index.js",

    - 开发环境中运行
    "start": "cross-env NODE_ENV=development nest start -w --path tsconfig.json",

    - 开发环境中以debug模式运行
    "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",

    - 开发环境中以生成模式运行
    "start:prod": "cross-env NODE_ENV=production node dist/main",

    - 生产环境运行
    "prod": "cross-env NODE_ENV=production pm2-runtime start ecosystem.config.js",
    "prod:pm2": "cross-env NODE_ENV=production pm2 restart ecosystem.config.js",
    "prod:stop": "pm2 stop ecosystem.config.js",
    "prod:debug": "cross-env NODE_ENV=production nest start --debug --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "jest",
    "test:watch": "jest --watch",

    - 生成API 说明文档
    "doc": "compodoc -p tsconfig.json -s",

    - 读取所有的.env .env.development .env.production 文件, 并生成全局的类型声明，并写入到 types/env.d.ts 文件中
    "gen-env-types": "npx tsx scripts/genEnvTypes.ts || true",

    - 基础命令，供其他命令使用
    - typeorm-ts-node-esm 说明
      - 与 typeorm 配套使用
      - 支持 ESM 和 CommonJS
      - 自动支持 ESM 配置文件
      - -d 指定数据源，读取配置文件，通过配置文件的配置，告知typeorm从哪里加载数据库
    "typeorm": "cross-env NODE_ENV=development typeorm-ts-node-esm -d ./dist/config/database.config.js",

    - 更新数据库(或初始化数据)
    "migration:create": "npm run typeorm migration:create ./src/migrations/initData",

    - 注意：
      - 暂时去掉 _$(echo $npm_package_version | sed 's/\\./_/g')
    - 说明
      - 数据库迁移
      - 生成的迁移文件是一个 TypeScript 或 JavaScript 文件，包含 up 和 down 两个方法：
        - up：用于执行变更（例如创建表、添加列等）。
        - down：用于回滚变更（例如删除表、删除列等）。
    "migration:generate": "npm run typeorm migration:generate ./src/migrations/update-table",

    - 更新数据库(或初始化数据)
    "migration:run": "npm run typeorm -- migration:run",

    - 回滚到最后一次更新
    "migration:revert": "npm run typeorm -- migration:revert",

    - 清除日志文件夹
    "cleanlog": "rimraf logs",

    - docker相关命令
    "docker:build:dev": "docker compose --env-file .env --env-file .env.development up --build",
    "docker:build": "docker compose --env-file .env --env-file .env.production up --build",
    "docker:prod:up": "docker compose -f docker-compose.prod.yml --env-file .env --env-file .env.production up -d --pull=always",
    "docker:up": "docker compose --env-file .env --env-file .env.production up -d --no-build",
    "docker:down": "docker compose --env-file .env --env-file .env.production down",
    "docker:rmi": "docker compose --env-file .env --env-file .env.production stop nest-admin-server && docker container rm nest-admin-server && docker rmi nest-admin-server",
    "docker:logs": "docker compose --env-file .env --env-file .env.production logs -f"
  },
```

### 目录结构

|  根目录   |  一级目录  |  二级目录  |  三级目录  |  文件  |  备注  |
| --------- | --------- | --------- | --------- |--------- | --------- |
|   scripts  |
|*|*|*|*|   genEnvTypes.ts  | 自动创建env.d.ts文件
|*|*|*|*|   resetScheduler.ts   | 用于测试: 每天凌晨 *.*0 恢复初始数据
|   types    |*|*|*|*|   公用的.d.ts文件
|   src      |*|*|*|*|   工程主目录
|*|   assets  |*|*|*|   中、英文邮件模板
|*|   common  |*|*|*|   封装的公用工具
|*|*|   adapters   |*|*|    适配器
|*|*|*|*|   fastify.adapter.ts  |   fast适配器：nestJs默认是Express适配器
|*|*|*|*|   socket.adapter.ts   |   redis适配器cron-once.decorator.ts
|*|*|   decorators   |*|*|    自定义的装饰器
|*|*|*|*|   api-result.decorator.ts  |   生成返回结果装饰器
|*|*|*|*|   bypass.decorator.ts  |   当不需要转换成基础返回格式时添加该装饰器
|*|*|*|*|   cookie.decorator.ts  |   获取客户端Cookie
|*|*|*|*|   cron-once.decorator.ts  |   确保【定时任务】只在主进程或特定 Worker 进程中执行，而不是在所有进程中重复执行
|*|*|*|*|   field.decorator.ts  |   字段装饰器：用于验证接口参数
|*|*|*|*|   http.decorator.ts  |   http适配器
|*|*|*|*|   id-param.decorator.ts  |   验证前端传过来的参数ID 是否能被转为数字
|*|*|*|*|   idempotence.decorator.ts  |   验证重复请求
|*|*|*|*|   inject-redis.decorator.ts  |   封装导入redis的装饰器，常用于service
|*|*|*|*|   swagger.decorator.ts  |   Swagger/OpenAPI 文档中标记某个类或方法需要安全认证
|*|*|*|*|   transform.decorator.ts  |   接口参数，转换
|*|*|   dto   |*|*|    公用的dto
|*|*|*|*|   cursor.dto.ts  |   游标公用DTO
|*|*|*|*|   delete.dto.ts  |   批量删除DTO
|*|*|*|*|   id.dto.ts  |   单独删除DTO
|*|*|*|*|   operator.dto.ts  |   操作者DTO
|*|*|*|*|   pager.dto.ts  |   分页DTO
|*|*|   entity   |*|*|    公用的实体类
|*|*|   exceptions   |*|*|    公用的 接口异常类
|*|*|*|*|   biz.exception.ts  |   接口错误类，主要用于HTTP接口
|*|*|*|*|   not-found.exception.ts  |   未找到
|*|*|*|*|   socket.exception.ts  |   套接字错误类，主要用于websocket
|*|*|   filters   |*|*|    自定义过滤器
|*|*|*|*|   any-exception.filter.ts  |   公用的 接口 异常捕获
|*|*|   interceptors   |*|*|    接口返回的拦截器
|*|*|*|*|   idempotence.interceptor.ts  |   处理 重复请求
|*|*|*|*|   logging.interceptor.ts  |   请求加入 日志
|*|*|*|*|   timeout.interceptor.ts  |   处理超时
|*|*|*|*|   transform.interceptor.ts  |   统一处理接口请求与响应结果，如果不需要则添加 @Bypass 装饰器
|*|*|   model   |*|*|    公用model
|*|*|*|*|   response.model.ts  |   接口返回的请求体
|*|*|   pipes   |*|*|    公用pipes通道
|*|*|*|*|   creator.pipe.ts  |   接口新增 用到的 公共pipe
|*|*|*|*|   parse-int.pipe.ts  |   接口参数 字体 转 string
|*|*|*|*|   updater.pipe.ts  |   接口更新 用到的 公共pipe
|*|*|   config   |*|*|    全局配置项
|*|*|*|*|   app.config.ts  |   服务启动
|*|*|*|*|   database.config.ts  |   数据库配置
|*|*|*|*|   index.ts  |   配置整合
|*|*|*|*|   mailer.config.ts  |   邮箱配置SMTP
|*|*|*|*|   oss.config.ts  |   OSS文件系统配置
|*|*|*|*|   redis.config.ts  |   redis配置
|*|*|*|*|   SecurityConfig.config.ts  |   JWT配置
|*|*|*|*|   SwaggerConfig.config.ts  |   swagger配置
|*|*|   constants   |*|*|    公用枚举
|*|*|*|*|   cache.constant.ts  |   redis 存储的key
|*|*|*|*|   error-code.constant.ts  |   接口返回的错误信息
|*|*|*|*|   event-bus.constant.ts  |   eventBus key，例如过期
|*|*|*|*|   oss.constant.ts  |   oss 相关key，例如路径等
|*|*|*|*|   response.constant.ts  |   response contentType的类型
|*|*|*|*|   system.constant.ts  |   接口逻辑相关key
|*|*|   global   |*|*|    公用枚举
|*|*|*|*|   env.ts  |   环境变量相关方法
|*|*|   helper   |*|*|    针对service 封装的 辅助类
|*|*|*|    crud   |*|   增删改查公用类，便于继承
|*|*|*|*|   crud.factory.ts    |   公用Service 类
|*|*|*|*|   crud.factory.ts    |   公用Service curd 工厂类
|*|*|*|    paginate   |*|   公用 service 分页类
|*|*|*|*|   create-pagination.ts    |   *
|*|*|*|*|   index.ts    |   *
|*|*|*|*|   interface.ts    |   *
|*|*|*|*|   pagination.ts   |   *
|*|*|*|*|   catchError.ts   |    *
|*|*|*|*|   genRedisKey.ts   |    获取redis key
|*|*|   migrations   |*|*|    typeorm 数据库迁移
|*|*|   modles   |*|*|    业务逻辑

### 装饰器用法

- api-result.decorator.ts: 接口返回使用
```
export class DictItemController {
  constructor() {}

  // ApiResult 配置分页
  @ApiResult({ type: [DictItemEntity], isPage: true })
  async list(): Promise<Pagination<DictItemEntity>> {

  }

  // ApiResult 非分页
  @ApiResult({ type: DictItemEntity })
  async info(): Promise<DictItemEntity> {
  }

  // 查询接口 其他接口 不加  ApiResult
  async delete(): Promise<void> {

  }
}
```

- bypass.decorator.ts： 当不需要转换成基础返回格式时添加该装饰器
```
// @Bypass()
export class TestController {
  constructor(
  ) {}

  @Bypass
  async list() {
  }
}

```

- cookie.decorator.ts: Cookies 缓存装饰器

- cron-once.decorator.ts:
  - 如果当前进程是主进程（isMainProcess 为 true），则执行定时任务。
  - 如果当前进程是 cluster 模式下的 Worker 进程，并且是第一个 Worker（cluster.worker.id === 1），则执行定时任务。
  - 否则，返回一个空的装饰器（returnNothing），即不执行定时任务。
```
@Injectable()
export class CronService {
  private logger: Logger = new Logger(CronService.name)
  constructor(
    private readonly configService: ConfigService<ConfigKeyPaths>,
  ) {}

  @CronOnce(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredJWT() {
    this.logger.log('--> 开始扫表，清除过期的 token')

    const expiredTokens = await AccessTokenEntity.find({
      where: {
        expired_at: LessThan(new Date()),
      },
    })

    let deleteCount = 0
    await Promise.all(
      expiredTokens.map(async (token) => {
        const { value, created_at } = token

        await AccessTokenEntity.remove(token)

        this.logger.debug(
          `--> 删除过期的 token：${value}, 签发于 ${dayjs(created_at).format(
            'YYYY-MM-DD H:mm:ss',
          )}`,
        )

        deleteCount += 1
      }),
    )

    this.logger.log(`--> 删除了 ${deleteCount} 个过期的 token`)
  }
}
```

- field.decorator.ts: 字段装饰器
  - NumberField
  - StringField
  - BooleanField
  - DateField
  ```
  export class TestCreateDto extends OperatorDto {
    @ApiProperty({
        description: '字段1'
    })
    @NumberField({
        each: true
    })
    field_arr_number: number[]

    @ApiProperty({
        description: '字段2'
    })
    @NumberField({
        min: 1,
        max: 3,
        int: true,
        positive: true
    })
    field_number: number
  }
  ```

- http.decorator.ts
  - Ip: 快速获取Ip
  - Uri: 快速获取request path，并不包括url params
  ```
  export class TestController {
    constructor() {
    }

    @Post()
    create(@Body() data: TestCreateDto, @Ip() ip: string, @Uri() uri) {
      console.log('ip============', ip);
      console.log('uri============', uri);
    }
  }
  ```

- id-param.decorator.ts： 主要用于 Controller 的参数 id 转换
```
export class TestController {
  constructor(private readonly testService: TestService) {

  }

  @Post(":id")
  create(@IdParam() id: number) {
      console.log('id========', id);
  }
}

```

- idempotence.decorator.ts:  接口拦截器中，实际开发中一般用不上

- inject-redis.decorator.ts: redis 专用装饰器
```
@Injectable()
export class TestService {
  constructor(
    @InjectRedis() private redis: Redis,
  ) {}

  async set() {
    await this.redis.set(`str`, code, 'EX', 60 * 5)
  }

  async get() {
    await this.redis.get(`str`)
  }
}
```

- swagger.decorator.ts：作用是在 Swagger/OpenAPI 文档中标记某个类或方法需要安全认证
```
@ApiSecurityAuth()

export class DeptController {
  constructor() {

  }
}
```

- transform.decorator.ts: 参数转换装饰器
  - ToNumber: 转换string 为 number
  - ToInt: 转换 string 为 int
  - ToBoolean: 转换string 为 boolean
  - ToDate: 转换string 为 date
  - ToArray: 转换为数组，特别是对于查询参数
  - ToTrim: 可作用与数组 或者 字符串， 去掉空格
  - ToLowerCase: 作用域字符串 或者 数组，转为小写
  - ToUpperCase: 作用域字符串 或者 数组，转为大写
  ```
  export class TestCreateDto extends OperatorDto {
    @ToLowerCase()
    str_low: string

    @ToUpperCase()
    str_up: string
  }
  ```

### dto 继承
- CursorDto(cursor.dto.ts): 游标
- PagerDto(pager.dto.ts): 列表
```
// CursorDto、PagerDto 举例
export class UserQueryDto extends IntersectionType(PagerDto<UserDto>, PartialType(UserDto)) {
  @ApiProperty({ description: '归属大区', example: 1, required: false })
  @IsInt()
  @IsOptional()
  deptId?: number

  @ApiProperty({ description: '状态', example: 0, required: false })
  @IsInt()
  @IsOptional()
  status?: number
}
```

- BatchDeleteDto(delete.dto.ts): 批量删除
- IdDto(id.dto.ts): 批量删除
- OperatorDto(operator.dto.ts): 操作者dto，用于新增、更新
```
// BatchDeleteDto、IdDto、OperatorDto 举例说明
export class testDto extends OperatorDto {}
```

### 实体类
- common.entity.ts
  - CommonEntity
  ```
  export class CaptchaLogEntity extends CommonEntity {
  }
  ```

- CompleteEntity: 常用于 联表实体类
```
export class DeptEntity extends CompleteEntity {

}
```

### 异常类
- BusinessException(biz.exception.ts): 常用异常类
```
throw new BusinessException('str')
```

- CannotFindException(not-found.exception.ts): 抛出404错误
```
throw new CannotFindException()
```

- SocketException(socket.exception.ts): socket 专用异常类
```
throw new SocketException('str')
```
