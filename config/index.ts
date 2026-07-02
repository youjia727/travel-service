import dotenv from "dotenv";
import path from "node:path";
import mysql from "mysql2/promise";

/**
 * 配置管理模块
 * 负责加载环境变量和初始化数据库连接池
 */

// 获取当前环境，默认 development
const env = process.env.NODE_ENV || "development";

// 根据环境加载对应的环境变量文件
const envPaths = path.resolve(`.env.${env}`);

// 加载环境变量
dotenv.config({ path: envPaths });

/**
 * MySQL数据库连接池
 * 提供可重用的数据库连接，支持并发查询
 */
const db = mysql.createPool({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  waitForConnections: true,
  multipleStatements: true, // 允许多条SQL同时执行
  connectionLimit: 10,
});

export { db };
