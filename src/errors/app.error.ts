// src/errors/app.error.ts
import { ErrorCode, ErrorMessage, SystemErrorCodes } from "./error.codes";

/**
 * 應用程式錯誤
 *
 * Service 發生業務或系統錯誤時，
 * 統一拋出 AppError。
 */
export class AppError extends Error {
  public readonly statusCode: 200 | 500;
  public readonly bizCode: ErrorCode;
  public readonly details?: unknown;

  /**
   *
   * @param bizCode 業務錯誤碼
   * @param customMessage (選填) 自訂錯誤訊息，可覆蓋預設訊息
   * @param details (選填) 額外的錯誤資訊
   */
  constructor(bizCode: ErrorCode, customMessage?: string, details?: unknown) {
    const message = customMessage ?? ErrorMessage[bizCode] ?? "未知錯誤";

    super(message);

    this.name = "AppError";
    this.bizCode = bizCode;
    this.details = details;
    this.statusCode = SystemErrorCodes.has(bizCode) ? 500 : 200;
  }
}
