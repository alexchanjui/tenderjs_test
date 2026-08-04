// src/container.ts
import loggerInstance from "./utils/logger";
import prismaInstance from "./utils/prisma";
import redisInstance from "./utils/redis";

// Services
import { HealthService } from "./services/health.service";

// Controllers
import { HealthController } from "./controllers/health.controller";
import type { IController } from "./controllers/interface/controller.interface";

// Types
import type { IServiceContext } from "./types/service.context";

/**
 * 應用程式容器
 *
 * 負責建立共用依賴，並組裝 Service 與 Controller，
 * 最後提供 Controller 清單給 Routes 使用。
 * Tip: 這裡只在 App 啟動時執行一次。
 */
export class AppContainer {
  /**
   * 取得所有 Controller
   */
  public getControllers(): IController[] {
    /**
     * 建立 Service 共用依賴
     */
    const ctx: IServiceContext = {
      logger: loggerInstance,
      prisma: prismaInstance.client,
      redis: redisInstance.client,
    };

    /**
     * 組裝 Services
     */
    const healthService = new HealthService(ctx);

    /**
     * 組裝 Controllers
     */
    return [new HealthController(healthService)];
  }
}
