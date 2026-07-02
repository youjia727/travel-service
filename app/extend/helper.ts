import { isNumberValue } from "@/utils";
import { HttpException } from "@/extend/http-exception";

const helper = {
  /**
   * 获取当前时间的ISO格式字符串
   * @returns 当前时间的ISO 8601格式字符串
   */
  moment() {
    return new Date().toISOString();
  },

  /**
   * 生成唯一的ID字符串
   * @returns 基于时间戳和随机数生成的唯一ID字符串
   */
  createId() {
    return (+new Date() + Math.random()).toString(36).split(".")[0] as string;
  },
  /**
   * 生成成功的响应格式
   * @param data - 响应的数据内容，可选
   * @param message - 成功消息，默认为"请求成功"
   * @returns 标准化的成功响应对象
   */
  success: function (data?: unknown, message = "请求成功") {
    return {
      data: data ?? null,
      message,
      code: 200,
      success: true,
    };
  },

  /**
   * 生成只有消息的成功响应格式
   * @param message - 成功消息，默认为"请求成功"
   * @returns 只有消息的成功响应对象
   */
  message: function (message = "请求成功") {
    return {
      message,
      code: 200,
      success: true,
    };
  },

  /**
   * 生成服务器错误的响应格式
   * @param message - 错误消息，默认为"请求失败"
   * @returns 标准化的错误响应对象
   */
  error: function (message = "请求失败", code = 500) {
    return {
      message,
      code,
      success: false,
    };
  },

  /**
   * 受限通知响应格式
   * @param message - 通知消息，默认为"资源访问受限"
   * @returns 受限通知响应对象
   */
  warning: function (message = "资源访问受限") {
    return {
      message,
      code: 403,
      success: false,
    };
  },

  /**
   * 生成登录过期的通知响应格式
   * @param message - 通知消息，默认为"登录已过期，请重新登录！"
   * @returns 登录过期通知响应对象
   */
  notices: function (message = "登录已过期，请重新登录！") {
    return {
      message,
      code: 1414,
      success: false,
    };
  },

  /**
   * 生成参数缺失的响应格式
   * @param message - 错误消息，默认为"缺少必要参数"
   * @returns 参数缺失的响应对象
   */
  missing: function (message = "缺少必要参数", errors?: unknown) {
    return {
      message,
      code: 400,
      success: false,
      errors,
    };
  },

  /**
   * 对数组数据进行分页处理
   * @param data - 要进行分页的数组数据
   * @param page - 页码，从1开始
   * @param pageSize - 每页数据条数
   * @returns 包含分页信息的对象（列表、总数、页码、页大小）
   * @throws HttpException 当page或pageSize不是有效数字时抛出异常
   */
  pagination: function (data: any[], page: unknown, pageSize: unknown) {
    if (!isNumberValue(page) || !isNumberValue(pageSize)) {
      throw new HttpException("参数类型错误：page、pageSize 必须为数字");
    }
    const pageNumber = Number(page);
    const pageSizeNumber = Number(pageSize);
    const result = {
      list: data.slice((pageNumber - 1) * pageSizeNumber, pageNumber * pageSizeNumber),
      total: data.length,
      page: pageNumber,
      pageSize: pageSizeNumber,
    };
    return result;
  },
};

export default helper;
