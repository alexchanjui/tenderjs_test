// src/caches/permission.cache.ts
import type { Permission } from "@prisma/client";
import { pathToRegexp } from "path-to-regexp";
import logger from "../utils/logger";

/**
 * 快取的 API 權限規則
 */
export interface ICachedRule {
  id: number;
  method: string;
  regex: RegExp;
  isRequired: boolean;
}

/**
 * API 權限規則本機快取
 */
const cachedRules: ICachedRule[] = [];

/**
 * 重新載入 API 權限規則
 */
export const reloadRules = (permissions: Permission[]): void => {
  // 清空原本快取
  cachedRules.length = 0;

  // 重新載入權限規則
  for (const permission of permissions) {
    if (!permission.isActive) {
      continue;
    }

    const method = mapActionToMethod(permission.actionType);

    if (!method) {
      continue;
    }

    try {
      const { regexp } = pathToRegexp(permission.apiPath);

      cachedRules.push({
        id: permission.id,
        method,
        regex: regexp,
        isRequired: permission.isRequired,
      });
    } catch (error) {
      logger.error(`[PermissionCache] 路徑解析失敗: ${permission.apiPath}`, error);
    }
  }
};

/**
 * 找出目前 API 對應的權限規則
 */
export const findRouteRule = (method: string, path: string): ICachedRule | undefined => {
  return cachedRules.find((rule) => rule.method === method && rule.regex.test(path));
};

/**
 * Action Type 轉 HTTP Method
 */
const mapActionToMethod = (actionType: number): string | null => {
  switch (actionType) {
    case 0:
      return "GET";

    case 1:
      return "POST";

    case 2:
      return "PUT";

    case 3:
      return "DELETE";

    default:
      return null;
  }
};
