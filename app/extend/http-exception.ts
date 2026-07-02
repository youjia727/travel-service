/**
 * 自定义错误提示信息
 */
export class HttpException extends Error {
  public status: number;
  public code: number;

  constructor(message: string, code = 500, status = 500) {
    super(message);
    this.message = message;
    this.code = code;
    this.status = status;
  }
}

// 使用示例：throw new HttpException('未登录', 401, 401);
