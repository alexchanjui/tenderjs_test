// src/middlewares/global-permission.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import { findRouteRule } from "../services/permission.cache";
import { verifyAuthToken } from "../utils/auth.helper";
import { CacheService } from "../utils/cache.service";
import { requestContextStorage } from "../utils/request-context";

/**
 * 全域權限驗證 Middleware
 */
export const globalPermissionGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestPath = req.originalUrl.split("?")[0];
    const authHeader = req.headers.authorization;

    // 1. 找出目前 API 對應的權限規則
    const rule = findRouteRule(req.method, requestPath);

    // 2. 未設定權限規則時，只處理登入身分
    if (!rule) {
      if (!authHeader) {
        next();
        return;
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      const currentUser = await verifyAuthToken(token);

      requestContextStorage.run(currentUser, () => {
        next();
      });

      return;
    }

    // 3. 公開 API 不需要登入及權限驗證
    if (!rule.isRequired) {
      next();
      return;
    }

    // 4. 受權限保護的 API 必須有 Token
    if (!authHeader) {
      throw new AppError(ErrorCode.UNAUTH);
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    // 5. 驗證 Token 並取得登入者
    const currentUser = await verifyAuthToken(token);

    // 6. 沒有角色代表沒有權限
    if (!currentUser.roleId) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    // 7. 取得角色權限
    const permissionIds = await CacheService.getRolePermissions(
      currentUser.roleId,
    );

    // 8. 檢查角色是否擁有目前 API 權限
    if (!permissionIds.includes(rule.id)) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    // 9. 建立 Request Context
    requestContextStorage.run(currentUser, () => {
      next();
    });
  } catch (error) {
    next(error);
  }
};
