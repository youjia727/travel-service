import { Router } from "express";
import travelController from "@/controller/travelController";
import { tokenValidator } from "@/middleware/validator";

/**
 * 主路由配置
 * 定义应用程序的所有路由和中间件
 */
const router = Router();

/**
 * 旅游相关路由
 * 所有 /travel 路径的请求都需要经过token验证
 */
router.use("/travel", tokenValidator, travelController);

export default router;
