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
    if (!secret) throw new Error("❌ 未設定 JWT_SECRET 環境變數，服務無法啟動！");
    this.jwtSecret = new TextEncoder().encode(secret);
  }

  public async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: "0o1i",
      noise: 1,
      color: false,
      background: "#ffffff",
    });

    const captchaId = randomUUID();
    await this.ctx.redis.set(
      `${this.CAPTCHA_PREFIX}${captchaId}`,
      captcha.text.toLowerCase(),
      "EX",
      300,
    );

    return {
      captchaId,
      svg: captcha.data,
      ...(process.env.NODE_ENV === "development" && { text: captcha.text }),
    };
  }

  public async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const { username, password, captchaId, captcha } = data;
    const redisKey = `${this.CAPTCHA_PREFIX}${captchaId}`;
    const storedCaptcha = await this.ctx.redis.get(redisKey);

    if (!storedCaptcha) throw new AppError(ErrorCode.CAPTCHA_EXPIRED);
    if (storedCaptcha !== captcha.toLowerCase()) throw new AppError(ErrorCode.CAPTCHA_ERROR);
    await this.ctx.redis.del(redisKey);

    const user = await this.validateUser(username, password);
    return this.generateTokenResponse(user);
  }

  public async autoLogin(data: AutoLoginRequestDto): Promise<LoginResponseDto> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("此功能僅限開發環境使用");
    }

    const user = await this.validateUser(data.username, data.password);
    return this.generateTokenResponse(user);
  }

  private async validateUser(username: string, password: string): Promise<User> {
    const user = await this.ctx.repos.user.findByUsername(username);

    if (!user) throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    if (!user.isActive) throw new AppError(ErrorCode.ACCOUNT_DISABLED);
    if (!(await bcrypt.compare(password, user.password))) {
      throw new AppError(ErrorCode.PASSWORD_ERROR);
    }

    return user;
  }

  private async generateTokenResponse(user: User): Promise<LoginResponseDto> {
    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      userType: user.userType,
      vendorId: user.vendorId,
    };

    const token = await new SignJWT(userPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || "1d")
      .sign(this.jwtSecret);

    return plainToInstance(LoginResponseDto, { token, user }, { excludeExtraneousValues: true });
  }
}
