// src/middlewares/global-permission.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { findRouteRule } from "../caches/permission.cache";
import { getRolePages } from "../caches/rolePage.cache";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import { verifyAuthToken } from "../utils/auth.helper";
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

    // 2. 公開 API 不需要登入及權限驗證
    if (rule && !rule.isRequired) {
      next();
      return;
    }

    // 3. 非公開 API 必須登入
    if (!authHeader) {
      throw new AppError(ErrorCode.UNAUTH);
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    // 4. 驗證 Token 並取得登入者
    const currentUser = await verifyAuthToken(token);

    // 5. 未設定權限規則，只驗證登入身分
    if (!rule) {
      requestContextStorage.run(currentUser, () => {
        next();
      });

      return;
    }

    // 6. 沒有角色代表沒有權限
    if (!currentUser.roleId) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    // 7. 取得角色頁面權限
    const rolePages = await getRolePages(currentUser.roleId);

    // 8. 取得目前 API 所屬頁面權限
    const rolePage = rolePages.find((rolePage) => rolePage.pageCode === rule.pageCode);

    if (!rolePage) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    // 9. GET 允許 VIEW / EDIT，其餘操作需要 EDIT
    const hasPermission =
      req.method === "GET"
        ? rolePage.accessLevel === "VIEW" || rolePage.accessLevel === "EDIT"
        : rolePage.accessLevel === "EDIT";

    if (!hasPermission) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    // 10. 建立 Request Context
    requestContextStorage.run(currentUser, () => {
      next();
    });
  } catch (error) {
    next(error);
  }
};
