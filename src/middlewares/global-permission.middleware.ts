// src/middlewares/global-permission.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { findRouteRule } from "../caches/permission.cache";
import { getRolePages } from "../caches/rolePage.cache";
import { getRolePermissionIds } from "../caches/rolePermission.cache";
import { getVendorPermissionIds } from "../caches/vendorPermission.cache";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import { verifyAuthToken } from "../utils/auth.helper";
import { requestContextStorage } from "../utils/request-context";

export const globalPermissionGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestPath = req.originalUrl.split("?")[0];
    const authHeader = req.headers.authorization;
    const rule = findRouteRule(req.method, requestPath);

    if (rule && !rule.isRequired) {
      next();
      return;
    }

    if (!authHeader) {
      throw new AppError(ErrorCode.UNAUTH);
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const currentUser = await verifyAuthToken(token);

    if (!rule) {
      requestContextStorage.run(currentUser, () => next());
      return;
    }

    if (!currentUser.roleId) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    if (rule.pageId !== null) {
      const rolePages = await getRolePages(currentUser.roleId);
      if (!rolePages.some((item) => item.pageId === rule.pageId)) {
        throw new AppError(ErrorCode.PERMISSION);
      }
    }

    const rolePermissionIds = await getRolePermissionIds(currentUser.roleId);
    if (!rolePermissionIds.includes(rule.permissionId)) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    if (currentUser.userType === "VENDOR") {
      if (!currentUser.vendorId) {
        throw new AppError(ErrorCode.PERMISSION);
      }

      const vendorPermissionIds = await getVendorPermissionIds(currentUser.vendorId);

      if (!vendorPermissionIds.includes(rule.permissionId)) {
        throw new AppError(ErrorCode.PERMISSION);
      }
    }

    requestContextStorage.run(currentUser, () => next());
  } catch (error) {
    next(error);
  }
};
