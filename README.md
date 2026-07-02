# 智能旅游助手服务 (Travel Service)

一个基于Node.js + Express + LangChain构建的智能旅游推荐和对话系统，支持AI驱动的旅游规划和大模型对话功能。

## 🚀 快速开始

### 环境要求
- Node.js >= 18.x
- MySQL >= 8.0
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd travel-service
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
复制环境配置文件并修改：
```bash
# 开发环境
cp .env.development .env.local
# 或生产环境
cp .env.production .env.local
```

修改`.env.local`文件中的配置：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=travel_schedule
DB_USER=root
DB_PASS=your_password_here

# OpenAI配置
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4

# 应用配置
PORT=3000
NODE_ENV=development
```

4. **初始化数据库**
运行MySQL并执行`config/mysql.ts`中的SQL语句创建表结构。

5. **启动服务**
```bash
# 开发模式（带热重载）
npm run dev

# 生产模式
npm run build
npm start
```

## 📁 项目结构

```
travel-service/
├── app/                    # 应用主目录
│   ├── controller/        # 控制器层
│   │   └── travelController.ts
│   ├── middleware/        # 中间件
│   │   ├── error.ts      # 错误处理
│   │   └── validator.ts  # 验证中间件
│   ├── model/            # 数据模型
│   │   ├── filebase.ts   # 文件存储
│   │   ├── mock/         # 模拟数据
│   │   └── types/        # 类型定义
│   ├── service/          # 业务逻辑层
│   │   ├── travelService.ts
│   │   └── langchainService.ts
│   ├── router/           # 路由配置
│   ├── extend/           # 扩展功能
│   ├── utils/            # 工具函数
│   └── index.ts          # 应用入口
├── config/               # 配置文件
├── table/                # 数据文件
├── aidlc-docs/           # AI开发文档
└── package.json          # 项目依赖
```

## 🔧 技术栈

- **运行时**: Node.js + TypeScript
- **Web框架**: Express.js
- **数据库**: MySQL + mysql2驱动
- **AI集成**: LangChain + OpenAI API
- **开发工具**: 
  - ESLint + Prettier（代码规范）
  - tsx（TypeScript执行器）
  - dotenv（环境变量管理）
- **安全**: 
  - cookie-session（会话管理）
  - cors（跨域支持）

## 🌐 API接口

### 旅游推荐
```http
GET /recommend?city=北京&budget=5000&days=5
```

**参数**:
- `city`: 旅游城市（必填）
- `budget`: 预算金额，不低于100元（必填）
- `days`: 旅游天数，1-31天（必填）

**响应**:
```json
{
  "success": true,
  "data": {
    "recommendations": "AI生成的旅游推荐内容"
  }
}
```

### AI对话
```http
POST /chat
Content-Type: application/json

{
  "message": "你好，我想去三亚旅游"
}
```

### 聊天历史
```http
GET /chat-history?sessionId=xxx&page=1&pageSize=20
```

### 删除聊天记录
```http
POST /chat-delete
```

### 清空会话
```http
POST /session-delete
```

## 🔒 安全性考虑

### 已实现的安全措施
1. **参数验证**: 所有API都有基本的参数验证
2. **Token验证**: 使用中间件验证请求头中的token
3. **错误处理**: 统一的HTTP异常处理
4. **环境隔离**: 开发、测试、生产环境分离（为了避免敏感信息泄露，生产环境使用docker中的环境变量，不要使用.env.production文件中变量，这仅使用开发测试）

## 🛠️ 开发指南

### 代码规范
```bash
# 检查代码规范
npm run lint

# 自动修复
npm run lint:fix

# 代码格式化
npm run format

# 检查格式化
npm run format:check
```

### 测试
```bash
# 测试模式启动
npm run test
```

### 构建部署
```bash
# TypeScript编译
npm run build

# 生产环境启动
npm start
```

## 📊 数据表结构

### chat_session (会话表)
- `id`: 自增主键
- `session_id`: 会话唯一ID
- `title`: 会话标题
- `create_time`: 创建时间
- `is_deleted`: 软删除标记

### chat_message (消息表)
- `id`: 消息自增主键
- `session_id`: 关联会话ID
- `role`: 角色(user/assistant/system)
- `content`: 文本内容
- `image_urls`: 图片URL数组(JSON)
- `embedding`: 向量数据(JSON)
- `create_time`: 创建时间

## 🐛 故障排除

### 常见问题
1. **数据库连接失败**
   - 检查MySQL服务是否运行
   - 验证`.env.local`中的数据库配置

2. **AI服务不可用**
   - 检查OpenAI API密钥是否正确
   - 确认网络连接

3. **TypeScript编译错误**
   - 运行`npm run build`查看具体错误
   - 确保所有依赖已安装

### 调试
开发模式下，应用会在端口4399启动，可通过浏览器访问`http://localhost:4399`测试API。

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request

## 📄 许可证

ISC License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issue页面
- 开发团队内部沟通渠道

---

**版本**: 1.0.0  
**最后更新**: 2026年6月
