// src/errors/error.codes.ts

/**
 * 業務邏輯錯誤代碼
 */
export enum ErrorCode {
  /**
   * 核心代碼
   */
  SUCCESS = 0, // 成功
  FAIL = 1, // 通用失敗
  UNAUTH = 2, // 使用者尚未登入或 Token 無效
  PERMISSION = 3, // 權限不足
  NOT_FOUND = 4, // 找不到資源
  LOCAL_ERROR = 5, // 系統發生未預期錯誤
  TOO_MANY_REQUESTS = 6, // 請求過於頻繁

  /**
   * 請求與驗證
   */
  REQUEST_DATA = 101, // 請求參數錯誤
  STRING_LIMIT = 102, // 字串長度不符合規範

  /**
   * 資料庫與快取
   */
  DATABASE_ERROR = 110, // 資料庫錯誤
  DATABASE_EXEC = 112, // SQL 執行失敗
  REDIS_ERROR = 114, // Redis 發生錯誤
  DATA_NOT_FOUND = 117, // 找不到指定資料
  DUPLICATE = 118, // 資料已存在

  /**
   * 登入與狀態
   */
  ACCOUNT_PERMISSION = 300, // 帳戶權限不足
  ACCOUNT_NOT_EXIST = 301, // 帳號不存在
  ACCOUNT_DISABLED = 302, // 帳號已停用
  ACCOUNT_AND_PASSWORD = 303, // 帳號或密碼錯誤
  ACCOUNT_EXIST = 304, // 帳號已存在
  CREATE_USER_FAILED = 306, // 建立使用者失敗
  AUTH_TOKEN_EXPIRED = 316, // 登入狀態已失效，請重新登入
  CAPTCHA_ERROR = 317, // 驗證碼錯誤
  CAPTCHA_EXPIRED = 318, // 驗證碼已過期

  /**
   * 密碼
   */
  PASSWORD_ERROR = 310, // 密碼錯誤
  PASSWORD_FORMAT = 311, // 密碼格式錯誤
  ENCODE_FAIL = 314, // 密碼加密失敗
  DECODE_FAIL = 315, // 密碼驗證失敗

  ROUTE_NOT_FOUND = 404, // API 路由不存在
}

/**
 * 錯誤碼預設訊息
 */
export const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.SUCCESS]: "成功",
  [ErrorCode.FAIL]: "操作失敗",
  [ErrorCode.UNAUTH]: "認證錯誤",
  [ErrorCode.PERMISSION]: "權限不足",
  [ErrorCode.NOT_FOUND]: "找不到資源",
  [ErrorCode.LOCAL_ERROR]: "系統錯誤",
  [ErrorCode.TOO_MANY_REQUESTS]: "請求過於頻繁",

  [ErrorCode.REQUEST_DATA]: "參數錯誤",
  [ErrorCode.STRING_LIMIT]: "字數長度錯誤",

  [ErrorCode.DATABASE_ERROR]: "資料庫錯誤",
  [ErrorCode.DATABASE_EXEC]: "資料庫執行錯誤",
  [ErrorCode.REDIS_ERROR]: "Redis 錯誤",
  [ErrorCode.DATA_NOT_FOUND]: "找不到資料",
  [ErrorCode.DUPLICATE]: "資料重複",

  [ErrorCode.ACCOUNT_PERMISSION]: "帳戶權限不足",
  [ErrorCode.ACCOUNT_NOT_EXIST]: "帳號不存在",
  [ErrorCode.ACCOUNT_DISABLED]: "帳號已停用",
  [ErrorCode.ACCOUNT_AND_PASSWORD]: "帳號或密碼錯誤",
  [ErrorCode.ACCOUNT_EXIST]: "帳號已存在",
  [ErrorCode.CREATE_USER_FAILED]: "建立使用者失敗",
  [ErrorCode.AUTH_TOKEN_EXPIRED]: "登入狀態已失效，請重新登入",
  [ErrorCode.CAPTCHA_ERROR]: "驗證碼錯誤",
  [ErrorCode.CAPTCHA_EXPIRED]: "驗證碼已過期",

  [ErrorCode.PASSWORD_ERROR]: "密碼錯誤",
  [ErrorCode.PASSWORD_FORMAT]: "密碼格式錯誤",
  [ErrorCode.ENCODE_FAIL]: "密碼加密失敗",
  [ErrorCode.DECODE_FAIL]: "密碼驗證失敗",

  [ErrorCode.ROUTE_NOT_FOUND]: "API 路由不存在",
};

/**
 * 系統錯誤代碼
 *
 * 這些錯誤使用 HTTP 500 回傳，
 * 其他業務錯誤使用 HTTP 200 回傳。
 */
export const SystemErrorCodes = new Set<ErrorCode>([
  ErrorCode.LOCAL_ERROR,
  ErrorCode.DATABASE_ERROR,
  ErrorCode.DATABASE_EXEC,
  ErrorCode.REDIS_ERROR,
  ErrorCode.ENCODE_FAIL,
  ErrorCode.DECODE_FAIL,
]);
