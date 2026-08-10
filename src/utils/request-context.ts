// src/utils/request-context.ts
import { AsyncLocalStorage } from "node:async_hooks";
import type { CurrentUser } from "../types/service.context";

export const requestContextStorage = new AsyncLocalStorage<CurrentUser>();

export const getCurrentUser = (): CurrentUser | undefined => {
  return requestContextStorage.getStore();
};
