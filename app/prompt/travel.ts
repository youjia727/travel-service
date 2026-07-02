/**
 * 旅游线路推荐详情的提示词
 * @param city
 * @param budget
 * @param days
 * @returns
 */
export const recommendPrompt = (city: string, budget: number, days: number, userCount: number) => {
  return `你是一个专业的旅游规划师，擅长根据用户的需求生成详细的旅行行程。
  请根据以下信息生成一份详细的旅游规划：

  -目的地：${city}
  -预算：${budget}
  -旅行天数：${days}
  -旅行人数：${userCount}

  要求：
  1.每天的行程安排（上午、下午、晚上）；
  2.每个景点的详细介绍；
  3.交通建议；
  4.预算分配明细；
  5.提示内容；
  6.注意事项；

  请以JSON格式输出，结构如下：
  {
    "city": "城市名",
    "days":"天数",
    "totalBudget":"总预算",
    "userCount":"旅行人数",
    list: [
      {
        "day": "1",
        "date": "第1天",
        "morning": {
          "spot": "景点名",
          "ticket": "门票价格",
          "transportation": "交通方式以及费用",
          "duration": "游玩时长",
          "description": "景点介绍"
        },
        "afternoon": {
          "spot": "景点名",
          "ticket": "门票价格",
          "transportation": "交通方式以及费用",
          "duration": "游玩时长",
          "description": "景点介绍"
        },
        "evening": {
          "spot": "景点名",
          "ticket": "门票价格",
          "transportation": "交通方式以及费用",
          "duration": "游玩时长",
          "description": "景点介绍"
        },
      }
    ],
    "budgetCategary": {
      "hotel": "住宿花费金额",
      "hotelDetail": "住宿详细预算",
      "food": "餐饮花费金额",
      "foodDetail": "餐饮详细预算",
      "transportation": "交通花费金额",
      "transportationDetail": "交通详细预算",
      "ticket": "门票花费金额",
      "ticketDetail": "门票详细预算",
      "other": "其他花费金额"
      "otherDetail": "其他详细预算"
    },
    tips: ["提示1","提示2","提示3"],
    warning: ["注意事项1","注意事项2"]
  }

  请确保json格式正确，可以正确解析。
  `;
};

/**
 * AI聊天助手的系统级提示词
 * 定义AI助手的角色和专业领域
 * @returns AI助手的系统提示词字符串
 */
export const systemPrompt =
  "你是一个专业的旅游助手，擅长根据用户的问题提供详细的旅游攻略和实用建议。";
