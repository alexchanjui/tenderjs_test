// src/utils/auth.helper.ts
import { jwtVerify } from "jose";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { CurrentUser } from "../types/service.context";
import type { UserType } from "../types/account-scope";

export const verifyAuthToken = async (token: string): Promise<CurrentUser> => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_secret_key");
    const { payload } = await jwtVerify(token, secret);

    if (!payload.id || !payload.userType) {
      throw new AppError(ErrorCode.UNAUTH, "Token 格式錯誤");
    }

    return {
      id: payload.id as string,
      roleId: (payload.roleId as string) ?? null,
      userType: payload.userType as UserType,
      vendorId: (payload.vendorId as string) ?? null,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(ErrorCode.UNAUTH, "Token 驗證失敗");
  }
};
