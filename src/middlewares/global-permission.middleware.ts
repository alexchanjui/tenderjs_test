// src/middlewares/global-permission.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { getNodePageIds } from "../caches/nodePage.cache";
import { findRouteRule } from "../caches/permission.cache";
import { getRolePageIds } from "../caches/rolePage.cache";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { RequestContext } from "../types/service.context";
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

    // 5. 取得目前操作的 Node ID
    const headerNodeId = req.headers["x-node-id"];
    const requestedNodeId = Array.isArray(headerNodeId) ? headerNodeId[0] : headerNodeId;
    const currentNodeId = requestedNodeId || currentUser.nodeId;

    // 6. 設定 Audit Context
    req.auditContext = {
      userId: currentUser.id,
      currentNodeId,
    };

    // 7. 業者只能操作自己的 Node
    if (currentUser.nodeType === "VENDOR" && currentNodeId !== currentUser.nodeId) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    // 8. 建立 Request Context
    const requestContext: RequestContext = {
      currentUser,
      currentNodeId,
    };

    // 9. 未設定權限規則，只驗證登入身分
    if (!rule || rule.pageId === null) {
      requestContextStorage.run(requestContext, () => {
        next();
      });

      return;
    }

    // 10. 沒有角色代表沒有權限
    if (!currentUser.roleId) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    // 11. 取得目前操作環境的頁面權限
    const pageIds =
      currentNodeId === currentUser.nodeId
        ? await getRolePageIds(currentUser.roleId)
        : await getNodePageIds(currentNodeId);

    // 12. 確認是否具有目前 API 所屬頁面的權限
    if (!pageIds.includes(rule.pageId)) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    // 13. 建立 Request Context
    requestContextStorage.run(requestContext, () => {
      next();
    });
  } catch (error) {
    next(error);
  }
};
