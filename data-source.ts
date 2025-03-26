import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql", // 数据库类型（如 mysql、sqlite、mssql 等）
  host: "localhost", // 数据库地址
  port: 3306, // 端口（PostgreSQL 默认 5432，MySQL 默认 3306）
  username: "root", // 用户名
  password: "123456", // 密码
  database: "nest-admin", // 数据库名
  synchronize: true, // 是否自动同步实体到数据库表（生产环境建议关闭）
  logging: true, // 是否启用 SQL 日志
  entities: ["dist/modules/**/*.entity{.ts,.js}"], // 实体类（或直接指定路径，如 ["src/entity/**/*.ts"]）
  // migrations: ["src/migrations/**/*.ts"], // 迁移文件路径
  subscribers: [], // 订阅者（可选）
  extra: {
    ssl: false // 是否启用 SSL（如云数据库可能需要）
  }
});



// export const dataSourceOption: DataSourceOptions = {
//     type: 'better-sqlite3',
//     // database: path.join(__dirname, '..', 'db', 'sqlite3.sqlite3'),
//     database: ':memory:',
//     synchronize: true,
//     dropSchema: true,
//     enableWAL: true,
//     entities:["dist/modules/**/*.entity{.ts,.js}"]
//   };
  
  // const dataSource = new DataSource(dataSourceOption);
  
  // export default dataSource;
