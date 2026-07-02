import { Router } from "express";

/**
 * 包装异步处理函数，自动添加错误处理
 * 捕获异步控制器函数中的错误并传递给Express错误处理中间件
 * @param handler - 异步处理函数
 * @returns 包装后的处理函数
 */
function wrapHandler(handler: (...args: any[]) => any) {
  return async (req: any, res: any, next: any) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

/**
 * 批量重写Express Router的所有HTTP方法
 * 自动为异步控制器函数添加错误处理包装
 */
const methods = ["get", "post", "put", "delete", "patch"];
methods.forEach((method) => {
  const original = (Router.prototype as any)[method];
  (Router.prototype as any)[method] = function (...args: any[]) {
    // 最后一个参数是控制器函数
    const last = args.pop();
    // 判断是不是异步函数
    if (last && last.constructor.name === "AsyncFunction") {
      args.push(wrapHandler(last));
    } else {
      args.push(last);
    }
    return original.apply(this, args);
  };
});
