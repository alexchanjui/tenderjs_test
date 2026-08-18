// src/services/user.service.ts
import bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import {
  UserResponseDto,
  GetUserListRequestDto,
  type CreateUserDto,
  type GetUserListResponseDto,
} from "../dtos/user.dto";
import type { IServiceContext } from "../types/service.context";
import { ErrorCode } from "../errors/error.codes";
import { AppError } from "../errors/app.error";

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
      throw new AppError(ErrorCode.ACCOUNT_EXIST);
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
  public async getMyUserInfo(): Promise<UserResponseDto> {
    const id = this.ctx.currentUser?.id || "";

    const user = await this.ctx.repos.user.findById(id);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得使用者列表 (分頁)
   */
  public async getUsers(
    dto: GetUserListRequestDto,
  ): Promise<GetUserListResponseDto> {
    const { page, limit } = dto;

    const skip = (page - 1) * limit;

    const [users, total] = await this.ctx.repos.user.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: plainToInstance(UserResponseDto, users, {
        excludeExtraneousValues: true,
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
