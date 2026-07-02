export const enum RoleEnum {
  system = "system", // 系统角色（给 AI 定规矩、人设、输出格式，排在最开头）
  user = "user", // 用户角色（用户输入的问题）
  assistant = "assistant", // AI角色 （大模型返回的回答）
}

/**
 * 数据库表名
 */
export const enum TableNameEnum {
  CHAT_SESSION = "chat_session", // 聊天会话
  CHAT_MESSAGE = "chat_message", // 聊天消息
}

/**
 * 聊天消息场景
 */
export const enum ChatSceneEnum {
  planning = "planning", // 推荐场景,
  chat = "chat", // 咨询
}
