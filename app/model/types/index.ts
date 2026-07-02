import { RoleEnum } from "@/utils/enum";

// 单条对话结构
export interface SessionItem {
  id: number | string;
  title?: string; // 会话标题
  session_id: string; //会话ID
  create_time?: Date | string; // 创建时间
  is_deleted?: number; // 是否删除, 0:未删除, 1:已删除
  remark?: string | undefined; // 备注
}

// 单条对话结构
export interface ChatItem {
  id: number | string;
  session_id: string;
  device_id?: string; //设备ID
  role: RoleEnum;
  content: string;
  is_deleted?: number; // 是否删除, 0:未删除, 1:已删除
  create_time?: Date | string; // 创建时间
  embedding?: number[]; //向量
}
