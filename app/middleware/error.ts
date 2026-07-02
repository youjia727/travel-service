import type { NextFunction, Request, Response } from "express";
import { HttpException } from "@/extend/http-exception";

/**
 * Express全局错误处理中间件
 * 捕获应用程序中的所有错误并返回标准化的错误响应
 * @param err - 错误对象，可以是HttpException或普通Error
 * @param req - Express请求对象
 * @param res - Express响应对象
 * @param next - Express next函数
 */
export function errorHandler(
  err: Error | HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("error=========", err);
  if (err instanceof HttpException) {
    res.status(err.status).json({
      code: err.code,
      message: err.message,
      success: false,
    });
  } else {
    res.status(500).json({
      code: 500,
      message: "服务器异常",
      success: false,
    });
  }
}

/**
 * 404路由不存在处理中间件
 * 捕获所有未匹配的路由请求并返回404响应
 * @param req - Express请求对象
 * @param res - Express响应对象
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    code: 404,
    message: "接口地址不存在",
    success: false,
  });
}
