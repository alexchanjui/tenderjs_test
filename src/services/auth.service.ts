// src/services/auth.service.ts
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import type { IServiceContext } from "../types/service.context";
import { AutoLoginRequestDto, type LoginRequestDto, LoginResponseDto } from "../dtos/auth.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { User } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import svgCaptcha from "svg-captcha";
import { randomUUID } from "node:crypto";

export class AuthService {
  private readonly jwtSecret: Uint8Array;
  private readonly CAPTCHA_PREFIX = "captcha:";

  constructor(private readonly ctx: IServiceContext) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("❌ 未設定 JWT_SECRET 環境變數，服務無法啟動！");
    }
    this.jwtSecret = new TextEncoder().encode(secret);
  }

  /**
   * 產生登入驗證碼
   */
  public async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: "0o1i",
      noise: 1,
      color: false,
      background: "#ffffff",
    });

    const captchaId = randomUUID();
    const redisKey = `${this.CAPTCHA_PREFIX}${captchaId}`;

    // 驗證碼統一轉小寫儲存，並設定 5 分鐘後自動失效
    await this.ctx.redis.set(redisKey, captcha.text.toLowerCase(), "EX", 300);

    return {
      captchaId,
      svg: captcha.data,
      ...(process.env.NODE_ENV === "development" && {
        text: captcha.text,
      }),
    };
  }

  /**
   * 使用者登入
   */
  public async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const { username, password, captchaId, captcha } = data;

    // 驗證登入驗證碼
    const redisKey = `${this.CAPTCHA_PREFIX}${captchaId}`;
    const storedCaptcha = await this.ctx.redis.get(redisKey);

    // Redis 找不到，代表驗證碼已過期或不存在
    if (!storedCaptcha) {
      throw new AppError(ErrorCode.CAPTCHA_EXPIRED);
    }

    // 驗證碼錯誤
    if (storedCaptcha !== captcha.toLowerCase()) {
      throw new AppError(ErrorCode.CAPTCHA_ERROR);
    }

    // 驗證成功後立即刪除，避免同一組驗證碼重複使用
    await this.ctx.redis.del(redisKey);

    const user = await this.ctx.repos.user.findByUsername(username);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    if (!user.isActive) {
      throw new AppError(ErrorCode.ACCOUNT_DISABLED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(ErrorCode.PASSWORD_ERROR);
    }

    return this.generateTokenResponse(user);
  }

  /**
   * 自動登入（開發環境專用）
   */
  public async autoLogin(data: AutoLoginRequestDto): Promise<LoginResponseDto> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("此功能僅限開發環境使用");
    }

    const { username, password } = data;

    const user = await this.ctx.repos.user.findByUsername(username);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    if (!user.isActive) {
      throw new AppError(ErrorCode.ACCOUNT_DISABLED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(ErrorCode.PASSWORD_ERROR);
    }

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
