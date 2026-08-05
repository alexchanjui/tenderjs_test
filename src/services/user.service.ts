// src/services/user.service.ts
import bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { type CreateUserDto, UserResponseDto } from "../dtos/user.dto";
import type { IServiceContext } from "../types/service.context";

/**
 * User Service
 *
 * 負責處理使用者相關的商業邏輯，
 * 並透過 User Repository 操作使用者資料。
 */
export class UserService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立使用者
   */
  public async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const { username, email, password } = data;

    // 1. 檢查 Email 是否已存在
    const existingUser = await this.ctx.repos.user.findByEmail(email);

    if (existingUser) {
      throw new Error("Email 已被使用");
    }

    // 2. 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 建立使用者
    const newUser = await this.ctx.repos.user.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4. DTO 轉換
    return plainToInstance(UserResponseDto, newUser, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得目前登入的使用者資訊
   */
  public async getMyUser(): Promise<UserResponseDto> {
    const userId = this.ctx.currentUser?.id;

    if (!userId) {
      throw new Error("尚未登入");
    }

    const user = await this.ctx.repos.user.findById(userId);

    if (!user) {
      throw new Error("使用者不存在");
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
