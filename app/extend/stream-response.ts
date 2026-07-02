import type { Response } from "express";

/**
 * 创建流式响应数据
 */
export const createStreamResponse = (res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  return {
    write: (text: string) => {
      res.write(`data: ${JSON.stringify({ done: false, text })}\n\n`);
    },
    end: (text?: string) => {
      res.write(`data: ${JSON.stringify({ done: true, text })}\n\n`);
      res.end();
    },
    error: () => {
      res.write(`data: ${JSON.stringify({ done: true, error: true })}\n\n`);
      res.end();
    },
  };
};
