/**
 * 判断开发环境
 */
export const isDev = () => process.env.NODE_ENV === "development";
/**
 * 判断测试环境
 */
export const isTest = () => process.env.NODE_ENV === "test";
/**
 * 判断生产环境
 */
export const isProd = () => process.env.NODE_ENV === "production";

/**
 * 判断是否为数字（包含字符串形式的数字）
 */
export function isNumberValue(val: unknown): boolean {
  // 正则匹配纯数字，支持整数、小数
  const reg = /^\d+(\.\d+)?$/;
  if (typeof val === "number") {
    return !isNaN(val);
  }
  if (typeof val === "string") {
    return reg.test(val.trim());
  }
  return false;
}

/**
 * 模拟打字流式输出
 * @param res express响应对象
 * @param fullText 完整文案
 * @param delay 每个字间隔毫秒
 */
export async function streamText(res: any, fullText: string, delay = 60) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  // 把字符串拆成单个字符数组
  const chars = Array.from(fullText);

  for (const text of chars) {
    // SSE固定格式：data:内容\n\n
    res.write(`data: ${JSON.stringify({ done: false, text })}\n\n`);
    // 停顿
    await new Promise((r) => setTimeout(r, delay));
  }

  // 推送结束标识
  res.write(`data: ${JSON.stringify({ done: true, text: fullText })}\n\n`);
  res.end();
}
// const replyText =
//   "你好，很高兴为你服务。我们可以分析图片内容，也可以解答各类问题，支持图文多轮对话。";
// await streamText(res, replyText, 50);
