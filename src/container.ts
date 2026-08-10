// src/container.ts
import loggerInstance from "./utils/logger";
import prismaInstance from "./utils/prisma";
import redisInstance from "./utils/redis";

// Repositories
import { UserPrismaRepository } from "./repositories/prisma/user.prisma.repository";

// Services
import { HealthService } from "./services/health.service";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";

// Controllers
import { HealthController } from "./controllers/health.controller";
import { UserController } from "./controllers/user.controller";
import { AuthController } from "./controllers/auth.controller";
import type { IController } from "./controllers/interface/controller.interface";

// Types
import type { IServiceContext } from "./types/service.context";
import type { IDbContext } from "./types/db.context";

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
     * 建立 Repository Context (DB Context)
     */
    const dbContext: IDbContext = {
      logger: loggerInstance,
      prisma: prismaInstance.client,
    };

    /**
     * 建立 Repositories
     */
    const userRepo = new UserPrismaRepository(dbContext);

    /**
     * 建立 Service 共用依賴
     */
    const ctx: IServiceContext = {
      logger: loggerInstance,
      prisma: prismaInstance.client,
      redis: redisInstance.client,
      repos: {
        user: userRepo,
      },
    };

    /**
     * 組裝 Services
     */
    const healthService = new HealthService(ctx);
    const userService = new UserService(ctx);
    const authService = new AuthService(ctx);

    /**
     * 組裝 Controllers
     */
    return [
      new HealthController(healthService),
      new UserController(userService),
      new AuthController(authService),
    ];
  }
}
