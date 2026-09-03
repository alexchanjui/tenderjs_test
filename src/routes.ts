// src/routes.ts
import type { Application, Request, Response, NextFunction } from "express";
import { AppContainer } from "./container";
import logger from "./utils/logger";
import { globalPermissionGuard } from "./middlewares/global-permission.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { AppError } from "./errors/app.error";
import { ErrorCode } from "./errors/error.codes";

/**
 * 註冊應用程式路由
 */
export function registerRoutes(app: Application): void {
  const container = new AppContainer();
  const controllers = container.getControllers();
  const apiPrefix = "/api";

  app.use(requestLogger);
  app.use(apiPrefix, globalPermissionGuard);

  controllers.forEach((controller) => {
    app.use(`${apiPrefix}${controller.path}`, controller.router);

    logger.info(`[Router] Mapped ${apiPrefix}${controller.path}`);
  });

  app.use(apiPrefix, (_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(ErrorCode.ROUTE_NOT_FOUND));
  });
}
