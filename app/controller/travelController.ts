import { Router } from "express";
import helper from "@/extend/helper";
import travelService from "@/service/travelService";
import { createStreamResponse } from "@/extend/stream-response";
import { isNumberValue } from "@/utils";
import { HttpException } from "@/extend/http-exception";

const travelController = Router();

/**
 * 大模型生产旅游推荐信息
 */
travelController.get("/recommend", async (req, res) => {
  const { city, budget, days } = req.query as any;
  if (!city || !budget || !days) {
    return res.send(helper.missing("参数丢失，缺少必要参数"));
  }
  if (budget < 100 || days < 1 || days > 31) {
    return res.send(helper.missing("预算不能低于100元, 天数必须在1到31之间"));
  }
  // 模拟数据返回
  // res.send({
  //   data: recommendMockData,
  //   code: 200,
  //   message: "success",
  //   success: true,
  // });
  const result = await travelService.recommend(req);
  res.send(result);
});

/**
 * 与大模型进行对话
 */
travelController.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.send(helper.missing("参数丢失，缺少必要参数"));
  }
  // 创建流式请求
  const stream = createStreamResponse(res);
  // // 调用封装的大模型函数（这里直接返回数据）
  const result = await travelService.chatAssistant(
    req,
    (text: string) => {
      stream.write(text);
    }
  );
  stream.end(result);
});

/**
 * 获取聊天记录历史
 */
travelController.get("/chat-history", async (req, res) => {
  const { page = 1, pageSize = 20, sessionId = "", sence } = req.query;
  if (!sessionId) {
    throw new HttpException("参数丢失，缺少必要参数", 400, 200);
  }
  if (!isNumberValue(page) || !isNumberValue(pageSize)) {
    throw new HttpException("参数类型错误: page、pageSize 必须为数字", 400, 200);
  }
  // const result = fb.chatHistory(req);
  const result = await travelService.chatHistory(req);
  res.send(helper.success(result));
});

/**
 * 删除某一条聊天记录
 */
travelController.post("/chat-delete", async (req, res) => {
  await travelService.chatDelete(req);
  res.send(helper.success("删除成功"));
});

/**
 * 清空会话
 */
travelController.post("/session-delete", async (req, res) => {
  await travelService.sessionDelete(req);
  res.send(helper.success("删除成功"));
});

export default travelController;
