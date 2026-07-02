/**
 * MySQL数据库表结构定义
 * 包含聊天会话和聊天消息两个核心表的创建SQL语句
 */

/**
// 创建chat_session数据表（会话）
CREATE TABLE `chat_session` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `session_id` varchar(64) NOT NULL COMMENT '会话唯一 ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '会话标题',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '软删除 - 0 正常，1删除，默认0',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间，默认当前时间',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// 创建chat_message数据表（聊天信息）
CREATE TABLE `chat_message` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '消息自增主键',
  `session_id` varchar(64) NOT NULL COMMENT '关联会话 ID',
  `role` enum('user','assistant','system') NOT NULL COMMENT '角色：user用户角色，assistant大模型角色，system系统角色',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文本内容，用户发送信息或者AI回复消息',
  `image_urls` json DEFAULT NULL COMMENT '图片 URL JSON 数组',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除，0正常，1删除',
  `embedding` json DEFAULT NULL COMMENT '向量JSON数组',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/
