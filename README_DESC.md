### <center>框架说明</center>
#### 命令解释
```
"scripts": {
    // 1、postinstall 是 npm install 自带的钩子，在 npm install 之后，会立即进入postinstall的生命周期， 
    // 2、此处命令，将在npm install 后自动运行 scripts/genEnvTypes文件, 读取所有的.env .env.development .env.production 文件，
    // 3、并生成全局的类型声明，并写入到 types/env.d.ts 文件中
    "postinstall": "npm run gen-env-types",
    // 删除 构建的 dist 文件
    "prebuild": "rimraf dist",
    // 打包: 将 TypeScript 代码编译为 JavaScript，并输出到 dist 目录
    "build": "nest build",
    // 开发环境中运行
    "dev": "npm run start",
    // 以 调试模式 运行 可设置断点
    "dev:debug": "npm run start:debug",
    // 以 REPL 运行: 交互式编程环境，允许开发者逐行输入代码并立即查看结果
    "repl": "npm run start -- --entryFile repl",
    // 使用 ncc 将项目打包成一个单独的文件，并输出到 out 目录。
    // -o out 指定输出目录为 out。
    // -m 表示启用最小化(minify)输出文件。
    // -t  表示启用 TypeScript 支持（如果项目使用 TypeScript）。
    // 注意 需要 安装 ncc: npm i -g @vercel/ncc
    "bundle": "rimraf out && npm run build && ncc build dist/main.js -o out -m -t && chmod +x out/index.js",
    "start": "cross-env NODE_ENV=development nest start -w --path tsconfig.json",
    "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
    "start:prod": "cross-env NODE_ENV=production node dist/main",
    "prod": "cross-env NODE_ENV=production pm2-runtime start ecosystem.config.js",
    "prod:pm2": "cross-env NODE_ENV=production pm2 restart ecosystem.config.js",
    "prod:stop": "pm2 stop ecosystem.config.js",
    "prod:debug": "cross-env NODE_ENV=production nest start --debug --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    // 生成API 说明文档
    "doc": "compodoc -p tsconfig.json -s",
    // 读取所有的.env .env.development .env.production 文件, 并生成全局的类型声明，并写入到 types/env.d.ts 文件中
    "gen-env-types": "npx tsx scripts/genEnvTypes.ts || true",
    "typeorm": "cross-env NODE_ENV=development typeorm-ts-node-esm -d ./dist/config/database.config.js",
    "migration:create": "npm run typeorm migration:create ./src/migrations/initData",
    "migration:generate": "npm run typeorm migration:generate ./src/migrations/update-table_$(echo $npm_package_version | sed 's/\\./_/g')",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "cleanlog": "rimraf logs",
    "docker:build:dev": "docker compose --env-file .env --env-file .env.development up --build",
    "docker:build": "docker compose --env-file .env --env-file .env.production up --build",
    "docker:prod:up": "docker compose -f docker-compose.prod.yml --env-file .env --env-file .env.production up -d --pull=always",
    "docker:up": "docker compose --env-file .env --env-file .env.production up -d --no-build",
    "docker:down": "docker compose --env-file .env --env-file .env.production down",
    "docker:rmi": "docker compose --env-file .env --env-file .env.production stop nest-admin-server && docker container rm nest-admin-server && docker rmi nest-admin-server",
    "docker:logs": "docker compose --env-file .env --env-file .env.production logs -f"
  },
```
#### 目录结构

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














