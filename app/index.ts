/**
 * 应用程序入口文件
 * 配置Express应用、中间件、路由和启动服务器
 */

import "./extend/patch-express";
import "../config";
import express from "express";
import cors from "cors";
// import cookieSession from 'cookie-session'
import router from "./router";
import { isDev } from "./utils";
import { errorHandler, notFoundHandler } from "./middleware/error";

// 允许跨域访问的域名列表
const allowList = ["http://localhost:5173"];

// 创建Express应用实例
const app = express();
const PORT = process.env.PORT || 4399;

/**
 * 配置跨域资源共享（CORS）
 * 开发环境允许所有来源，生产环境限制指定域名
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // 本地开发直接放行
      if (isDev()) return callback(null, true);

      if (allowList.includes(origin as string)) {
        callback(null, origin);
      } else {
        callback(new Error("域名限制访问"));
      }
    },
    credentials: true, // 允许跨域携带cookie/token
  })
);

/**
 * 解析JSON请求体
 * false代表使用querystring是node的核心模块，用于处理（解析和格式化）URL的查询字符串;
 * true代表qs是一个增加了安全性的查询字符串解析和字符串序列化的库;
 */
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// // 设置会话中间件，keys和secret必须要有一个
// app.use(cookieSession({
//   name: "session-name",
//   secret: 'my_session_secret',
//   maxAge: 24 * 60 * 60 * 1000, //有效时间为24小时
// }))

// 注册应用路由
app.use(process.env.API_PREFIX!, router);

// 404路由不存在处理（兜底）
app.use(notFoundHandler);

// 全局异常处理中间件
app.use(errorHandler);

// 全局兜底日志，防止极端情况漏掉错误
process.on("unhandledRejection", (reason) => {
  console.error("未捕获Promise异常：", reason);
});
process.on("uncaughtException", (err) => {
  console.error("进程崩溃异常：", err);
});

/**
 * 启动HTTP服务器
 */
app.listen(PORT, () => {
  console.log(`服务启动：http://localhost:${PORT}, ${process.env.NODE_ENV}模式`);
});

export default app;
