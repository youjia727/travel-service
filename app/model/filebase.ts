import fs from "fs";
import path from "path";
import type { SessionItem, ChatItem } from "./types";
import helper from "@/extend/helper";
import type { Request } from "express";

// 会话文件存放目录
const HISTORY_DIR = path.join(process.cwd(), "table");
if (!fs.existsSync(HISTORY_DIR)) {
  fs.mkdirSync(HISTORY_DIR, { recursive: true });
}

class FileBase {
  /**
   * 获取文件完整路径
   * @param fileName - 文件名（不含扩展名）
   * @returns 完整的文件路径
   */
  private getFilePath(fileName: string) {
    return path.join(HISTORY_DIR, `${fileName}.json`);
  }

  /**
   * 创建会话项对象
   * @param sessionId - 会话ID
   * @param remark - 可选备注信息
   * @returns 会话项对象
   */
  createSessionItem(sessionId: string, remark?: string): SessionItem {
    return {
      id: Date.now().toString(),
      session_id: sessionId,
      create_time: new Date().toISOString(),
      remark,
    };
  }

  /**
   * 读取文件内容
   * @param filePath - 文件路径（不含扩展名）
   * @returns 包含文件路径和解析后数据的对象
   */
  getFileContent(filePath: string): { filePath: string; data: any } {
    const file = this.getFilePath(filePath);
    const content = fs.readFileSync(file, "utf-8");
    return {
      filePath: file,
      data: content ? JSON.parse(content) : null,
    };
  }

  /**
   * 获取指定会话的所有聊天记录
   * @param sessionId - 会话ID
   * @returns 该会话的聊天记录数组
   */
  list(sessionId: string): ChatItem[] {
    const { data: chatHistoryList } = this.getFileContent("chat_history");
    if (!chatHistoryList) return [];
    return chatHistoryList.filter((item: ChatItem) => item.session_id === sessionId);
  }

  /**
   * 查询会话聊天记录（支持分页）
   * @param sessionId - 会话ID
   * @param page - 页码
   * @param pageSize - 每页记录数
   * @returns 分页后的聊天记录
   */
  queryChatHistory(sessionId: string, page: unknown, pageSize: unknown) {
    const allChatList = this.list(sessionId);
    return helper.pagination(allChatList, page, pageSize);
  }

  /**
   * 处理HTTP请求的聊天历史查询
   * @param req - Express请求对象
   * @returns 分页后的聊天记录
   */
  chatHistory(req: Request) {
    const { page = 1, pageSize = 20, sessionId } = req.query;
    return this.queryChatHistory(sessionId as string, page, pageSize);
  }

  /**
   * 保存聊天信息到文件
   * @param sessionId - 会话ID
   * @param chatItem - 聊天项对象
   */
  saveChatInfo(sessionId: string, chatItem: ChatItem) {
    const { data: sessionList, filePath: sessionPath } = this.getFileContent("chat_session");
    const newSessionList = sessionList ? sessionList : [];
    const hasSessionItem = newSessionList.some(
      (item: SessionItem) => item.session_id === sessionId
    );
    if (!hasSessionItem) {
      newSessionList.push(this.createSessionItem(sessionId, chatItem.content));
      fs.writeFileSync(sessionPath, JSON.stringify(newSessionList, null, 2));
    }
    const list = this.list(sessionId);
    list.push(chatItem);
    fs.writeFileSync(this.getFilePath("chat_history"), JSON.stringify(list, null, 2));
  }

  /**
   * 清除指定文件中的会话数据
   * @param sessionId - 会话ID
   * @param filePath - 文件路径（不含扩展名）
   * @returns 清除操作是否成功
   */
  clearFileItem(sessionId: string, filePath: string) {
    const { data, filePath: contentPath } = this.getFileContent(filePath);
    const cutList = data?.filter((item: SessionItem) => item.session_id !== sessionId);
    fs.writeFileSync(contentPath, JSON.stringify(cutList, null, 2));
    return true;
  }

  /**
   * 清空指定会话的所有记录
   * @param sessionId - 会话ID
   * @returns 清除操作是否成功
   */
  clear(sessionId: string) {
    this.clearFileItem(sessionId, "chat_session");
    this.clearFileItem(sessionId, "chat_history");
    return true;
  }
}

export default new FileBase();
