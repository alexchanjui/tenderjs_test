// src/utils/request-context.ts
import { AsyncLocalStorage } from "node:async_hooks";
import type { CurrentUser, RequestContext } from "../types/service.context";

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

/**
 * 取得目前登入使用者
 */
export const getCurrentUser = (): CurrentUser | undefined => {
  return requestContextStorage.getStore()?.currentUser;
};

/**
 * 取得目前操作的 Node ID
 */
export const getCurrentNodeId = (): string | undefined => {
  return requestContextStorage.getStore()?.currentNodeId;
};
