import langchainService from "./langchainService";
import { recommendPrompt, systemPrompt } from "@/prompt/travel";
import helper from "@/extend/helper";
import { RoleEnum, TableNameEnum } from "@/utils/enum";
import { db } from "../../config";
import type { ChatItem } from "@/model/types";
import type { Request } from "express";

class TravelService {
  private chatHistoryList: any[] = [];
  private sessionId: string = "";

  /**
   * 初始化历史记录
   */
  async initChatHistory(sessionId: string) {
    if (this.chatHistoryList.length && this.sessionId === sessionId) return this.chatHistoryList;
    this.chatHistoryList = [];
    const systemChatItem = { role: RoleEnum.system, content: systemPrompt };
    // const history = fb.queryChatHistory(sessionId, 1, 30);
    const { list } = await this.queryChatHistory(sessionId, 1, 30);
    this.chatHistoryList = [systemChatItem, ...list];
    this.sessionId = sessionId;
    return this.chatHistoryList;
  }

  /**
   * 推荐旅游生成详情内容
   */
  async recommend(request: Request) {
    const { city, budget, days, userCount = 1 } = request.query as any;
    const prompt = recommendPrompt(city, budget, days, userCount);
    // 组合提示词上下文
    const messageList = [{ role: RoleEnum.user, content: prompt }];
    // 调用大模型
    const result = await langchainService.langChainChatOnce(messageList);
    let parsedResult = result ? JSON.parse(result as string) : null;
    return helper.success(parsedResult);
  }

  /**
   * 聊天助手回复
   */
  async chatAssistant(request: Request, callback: Function) {
    const { message, sessionId } = request.body;
    const history = await this.initChatHistory(sessionId);
    const userChatItem = {
      id: helper.createId(),
      session_id: sessionId,
      role: RoleEnum.user,
      content: message,
      create_time: helper.moment(),
    };
    const clearMessage = message.slice(0, 50);
    await this.saveChatInfo(sessionId, { ...userChatItem, content: clearMessage });
    const messageList = [...history, userChatItem];
    let fullText = "";
    // 调用大模型
    for await (const chunk of langchainService.langChainChatStream(messageList)) {
      fullText = chunk.fullText;
      if (chunk.text.length > 0) {
        // 清理AI返回的内容
        callback?.(chunk.text);
      }
    }
    const assistantChatItem = {
      id: helper.createId(),
      role: RoleEnum.assistant,
      content: fullText,
      session_id: sessionId,
      create_time: helper.moment(),
    };
    this.chatHistoryList.push(userChatItem, assistantChatItem);
    await this.saveChatInfo(sessionId, assistantChatItem);
    return fullText;
  }

  /**
   * 查询数据库中数据
   */
  async queryChatHistory(sessionId: string, page: unknown, pageSize: unknown) {
    const numPage = Number(page);
    const numPageSize = Number(pageSize);
    const offset = (numPage - 1) * numPageSize;

    // 使用参数化查询
    const sql = `
      SELECT SQL_CALC_FOUND_ROWS * FROM ?? 
      WHERE session_id = ? AND is_deleted = 0 
      ORDER BY create_time LIMIT ?, ?;
      SELECT FOUND_ROWS() AS total;
    `;
    const params = [TableNameEnum.CHAT_MESSAGE, sessionId, offset, numPageSize];
    const [rows] = await db.query(sql, params);
    const [data, tols] = rows as any;
    return {
      list: data[0] ?? [],
      total: tols[0]?.total ?? 0,
      page: numPage,
      pageSize: numPageSize,
    };
  }

  /**
   * 获取历史列表会话列表（安全版本）
   */
  async chatHistory(request: Request) {
    const { page = 1, pageSize = 20, sessionId } = request.query;
    const result = await this.queryChatHistory(sessionId as string, page, pageSize);
    return result;
  }

  /**
   * 保存聊天信息
   */
  async saveChatInfo(sessionId: string, chatItem: ChatItem) {
    // 检查会话是否存在（使用参数化查询）
    const checkSessionSql = `SELECT 1 FROM ?? WHERE session_id = ? LIMIT 1`;
    const [rows] = (await db.query(checkSessionSql, [
      TableNameEnum.CHAT_SESSION,
      sessionId,
    ])) as any;
    if (!rows?.length) {
      // 创建新会话（使用参数化查询）
      const createSessionSql = `INSERT INTO ?? (session_id, title) VALUES (?, ?)`;
      await db.query(createSessionSql, [TableNameEnum.CHAT_SESSION, sessionId, chatItem.content]);
    }
    // 保存聊天信息（使用参数化查询）
    const saveMessageSql = `INSERT INTO ?? (session_id, role, content) VALUES (?, ?, ?)`;
    await db.query(saveMessageSql, [
      TableNameEnum.CHAT_MESSAGE,
      sessionId,
      chatItem.role,
      chatItem.content,
    ]);
  }

  /**
   * 删除指定的聊天记录
   */
  async chatDelete(request: Request) {
    const { id } = request.body;
    const sql = `DELETE FROM ?? WHERE id = ?`;
    const [rows]: any = await db.query(sql, [TableNameEnum.CHAT_MESSAGE, id]);
    return rows?.affectedRows?.length === 0;
  }

  /**
   * 删除整个会话及其所有聊天记录（安全版本）
   */
  async sessionDelete(request: Request) {
    const { sessionId } = request.body;
    const conn = await db.getConnection();
    try {
      // 开启事务
      await conn.beginTransaction();
      // 1. 删除消息
      const [sessionRes]: any = await conn.query("DELETE FROM ?? WHERE session_id = ?", [
        TableNameEnum.CHAT_SESSION,
        sessionId,
      ]);
      // 2. 删除会话
      const [msgRes]: any = await conn.query("DELETE FROM ?? WHERE session_id = ?", [
        TableNameEnum.CHAT_MESSAGE,
        sessionId,
      ]);
      // 提交事务
      await conn.commit();

      return sessionRes.affectedRows.length > 0 && msgRes.affectedRows.length > 0;
    } catch (err) {
      // 出错回滚，避免半删
      await conn.rollback();
      throw err;
    } finally {
      // 释放连接回池
      conn.release();
    }
  }
}

export default new TravelService();
