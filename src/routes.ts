// src/routes.ts
import type { Application } from "express";
import { AppContainer } from "./container";
import logger from "./utils/logger";
import { globalPermissionGuard } from "./middlewares/global-permission.middleware";

/**
 * 註冊應用程式路由
 */
export function registerRoutes(app: Application): void {
  const container = new AppContainer();
  const controllers = container.getControllers();
  const apiPrefix = "/api";

  app.use(apiPrefix, globalPermissionGuard);

  controllers.forEach((controller) => {
    app.use(`${apiPrefix}${controller.path}`, controller.router);

    logger.info(`[Router] Mapped ${apiPrefix}${controller.path}`);
  });
}
