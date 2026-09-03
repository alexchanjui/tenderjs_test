// src/services/auth.service.ts
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import type { IServiceContext } from "../types/service.context";
import { type LoginRequestDto, LoginResponseDto } from "../dtos/auth.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { User } from "@prisma/client";
import { plainToInstance } from "class-transformer";

export class AuthService {
  private readonly jwtSecret: Uint8Array;

  constructor(private readonly ctx: IServiceContext) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("❌ 未設定 JWT_SECRET 環境變數，服務無法啟動！");
    }
    this.jwtSecret = new TextEncoder().encode(secret);
  }
  /**
   * 使用者登入
   */
  public async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const { username, password } = data;

    // 1. 查詢使用者
    const user = await this.ctx.repos.user.findByUsername(username);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    // 2. 檢查使用者是否已停用
    if (!user.isActive) {
      throw new AppError(ErrorCode.ACCOUNT_DISABLED);
    }

    // 3. 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(ErrorCode.PASSWORD_ERROR);
    }

    // 4. 產生 Token 並回傳使用者資訊
    return this.generateTokenResponse(user);
  }

  /**
   * 產生 JWT Token 與使用者資料
   */
  private async generateTokenResponse(user: User): Promise<LoginResponseDto> {
    // 放進 JWT 的使用者資料
    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
    };

    // 產生 JWT Token
    const token = await new SignJWT(userPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || "1d")
      .sign(this.jwtSecret);

    return plainToInstance(
      LoginResponseDto,
      {
        token,
        user,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
