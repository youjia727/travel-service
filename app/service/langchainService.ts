import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { RoleEnum } from "@/utils/enum";

// 消息格式
export type ChatMessage = {
  role: RoleEnum;
  content: string;
};

const apiKey = process.env.OPENAI_API_KEY as string;
const baseURL = process.env.OPENAI_API_BASE_URL as string;
const model = process.env.OPENAI_MODEL as string;

class LangChainService {
  private llm: ChatOpenAI | null = null;

  /**
   * 构造函数，初始化LangChain服务
   */
  constructor() {
    this.initLLM();
  }

  /**
   * 初始化语言模型
   * 创建ChatOpenAI实例并配置API密钥、模型名称等参数
   */
  initLLM() {
    this.llm = new ChatOpenAI({
      apiKey,
      model,
      temperature: 0.7,
      streaming: true,
      configuration: {
        baseURL,
      },
    });
  }

  /**
   * 将自定义消息格式转换为LangChain消息实例
   * @param messageList - 自定义格式的消息数组
   * @returns LangChain消息实例数组
   */
  convertToLangChainMsg(messageList: ChatMessage[]) {
    return messageList.map((item) => {
      switch (item.role) {
        case RoleEnum.system:
          return new SystemMessage(item.content);
        case RoleEnum.user:
          return new HumanMessage(item.content);
        case RoleEnum.assistant:
          return new AIMessage(item.content);
        default:
          return new HumanMessage(item.content);
      }
    });
  }

  /**
   * 普通一次性完整回复
   */
  async langChainChatOnce(messageList: ChatMessage[]) {
    const messages = this.convertToLangChainMsg(messageList);
    const result = await this.llm?.invoke(messages);
    return result?.content;
  }

  /**
   * SSE 流式逐字输出（异步迭代器）
   */
  async *langChainChatStream(messageList: ChatMessage[]) {
    const messages = this.convertToLangChainMsg(messageList);
    const stream = (await this.llm?.stream(messages)) as ReadableStream;
    let fullText = "";
    for await (const chunk of stream) {
      const text = chunk?.content?.trim() || "";
      fullText += text;
      yield { fullText, text };
    }
  }
}

export default new LangChainService();
