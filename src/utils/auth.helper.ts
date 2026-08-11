// src/utils/auth.helper.ts
import { jwtVerify } from "jose";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { CurrentUser } from "../types/service.context";

/**
 * 驗證 JWT Token
 */
export const verifyAuthToken = async (token: string): Promise<CurrentUser> => {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "dev_secret_key",
    );

    // 1. 驗證 Token
    const { payload } = await jwtVerify(token, secret);

    // 2. 檢查 Token 是否包含使用者 ID
    if (!payload.id) {
      throw new AppError(ErrorCode.UNAUTH, "Token 格式錯誤: 缺少 ID");
    }

    // 3. 回傳目前登入者
    return {
      id: payload.id as string,
    };
  } catch (error) {
    // 保留自己定義的錯誤
    if (error instanceof AppError) {
      throw error;
    }

    // JWT 驗證失敗
    throw new AppError(ErrorCode.UNAUTH, "Token 驗證失敗");
  }
};
