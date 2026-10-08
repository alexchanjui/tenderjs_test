// src/caches/permission.cache.ts
import type { Permission } from "@prisma/client";
import { pathToRegexp } from "path-to-regexp";
import logger from "../utils/logger";

export interface ICachedRule {
  permissionId: number;
  pageId: number | null;
  isStatic: boolean;
  method: string;
  regex: RegExp;
  isRequired: boolean;
}

const cachedRules: ICachedRule[] = [];

export const reloadRules = (permissions: Permission[]): void => {
  cachedRules.length = 0;

  for (const permission of permissions) {
    if (!permission.isActive) continue;

    const method = mapActionToMethod(permission.actionType);
    if (!method) continue;

    try {
      const { regexp, keys } = pathToRegexp(permission.apiPath);

      cachedRules.push({
        permissionId: permission.id,
        pageId: permission.pageId,
        isStatic: keys.length === 0,
        method,
        regex: regexp,
        isRequired: permission.isRequired,
      });
    } catch (error) {
      logger.error(`[PermissionCache] 路徑解析失敗: ${permission.apiPath}`, error);
    }
  }
};

export const findRouteRule = (method: string, path: string): ICachedRule | undefined => {
  const staticRule = cachedRules.find(
    (rule) => rule.isStatic && rule.method === method && rule.regex.test(path),
  );

  return staticRule ?? cachedRules.find((rule) => rule.method === method && rule.regex.test(path));
};

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
