import helper from "@/extend/helper";
import type { Request, Response, NextFunction } from "express";

/**
 * Token验证中间件
 * 验证请求头中是否包含有效的token
 * @param req - Express请求对象
 * @param res - Express响应对象
 * @param next - Express next函数
 * @returns 如果token缺失则返回401未授权响应，否则继续执行下一个中间件
 */
export function tokenValidator(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["token"];
  if (!token) {
    return res.status(401).json(helper.notices());
  }
  next();
}
