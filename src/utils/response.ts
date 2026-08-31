// src/utils/response.ts
import type { Response } from "express";
import { ErrorCode, ErrorMessage } from "../errors/error.codes";

/**
 * 分頁資訊
 */
interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 帶 Meta 的成功結果
 */
export interface SuccessResult<T> {
  data: T;
  meta: PaginationMeta;
}

/**
 * 統一 API 回應格式
 */
export interface ApiResponse<T = unknown> {
  code: ErrorCode;
  msg: string;
  data?: T | null;
  meta?: PaginationMeta;
}

/**
 * 核心回應方法
 */
const sendResult = <T>(
  res: Response,
  httpStatus: 200 | 500,
  code: ErrorCode,
  msg: string,
  data?: T | null,
  meta?: PaginationMeta,
): void => {
  const response: ApiResponse<T> = {
    code,
    msg,
    ...(data !== undefined ? { data } : {}),
    ...(meta ? { meta } : {}),
  };

  res.status(httpStatus).json(response);
};

/**
 * 成功回應
 *
 * 一般資料：
 * success(res, result)
 *
 * 分頁資料：
 * success(res, { data: result, meta })
 */
export function success<T>(res: Response, data?: T, msg?: string): void;

export function success<T>(res: Response, result: SuccessResult<T>, msg?: string): void;

export function success<T>(
  res: Response,
  result: T | SuccessResult<T>,
  msg = ErrorMessage[ErrorCode.SUCCESS],
): void {
  if (typeof result === "object" && result !== null && "data" in result && "meta" in result) {
    const paginationResult = result as SuccessResult<T>;

    sendResult(res, 200, ErrorCode.SUCCESS, msg, paginationResult.data, paginationResult.meta);

    return;
  }

  sendResult(res, 200, ErrorCode.SUCCESS, msg, result as T);
}

/**
 * 業務錯誤回應
 */
export const failed = (
  res: Response,
  code: ErrorCode,
  msg = ErrorMessage[code],
  data: unknown = null,
): void => {
  sendResult(res, 200, code, msg, data);
};

/**
 * 系統錯誤回應
 */
export const error = (
  res: Response,
  code: ErrorCode = ErrorCode.LOCAL_ERROR,
  msg = ErrorMessage[code],
  data: unknown = null,
): void => {
  sendResult(res, 500, code, msg, data);
};
