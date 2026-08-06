// src/utils/response.ts
import type { Response } from "express";
import { ErrorCode, ErrorMessage } from "../errors/error.codes";

/**
 * 統一 API 回應格式
 */
export interface ApiResponse<T = any> {
  code: ErrorCode;
  msg: string;
  data: T | null;
}

/**
 * 核心回應方法
 */
const sendResult = <T>(
  res: Response,
  httpStatus: 200 | 500,
  code: ErrorCode,
  msg: string,
  data: T | null = null,
): void => {
  const response: ApiResponse<T> = {
    code,
    msg,
    data,
  };

  res.status(httpStatus).json(response);
};

/**
 * 成功回應
 */
export const success = <T>(
  res: Response,
  data: T | null = null,
  msg = ErrorMessage[ErrorCode.SUCCESS],
): void => {
  sendResult(res, 200, ErrorCode.SUCCESS, msg, data);
};

/**
 * 業務錯誤回應 (HTTP 200)
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
 * 系統錯誤回應 (HTTP 500)
 */
export const error = (
  res: Response,
  code: ErrorCode = ErrorCode.LOCAL_ERROR,
  msg = ErrorMessage[code],
  data: unknown = null,
): void => {
  sendResult(res, 500, code, msg, data);
};
