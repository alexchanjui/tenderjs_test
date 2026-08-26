// src/services/user.service.ts
import bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import {
  UserResponseDto,
  type CreateUserDto,
  type UpdateUserRequestDto,
} from "../dtos/user.dto";
import type {
  PaginationRequestDto,
  PaginationResponseDto,
} from "../dtos/pagination.dto";
import type { IServiceContext } from "../types/service.context";
import { ErrorCode } from "../errors/error.codes";
import { AppError } from "../errors/app.error";

export class UserService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立使用者
   */
  public async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const { username, email, password } = data;

    // 1. 檢查 Email 是否已存在
    const user = await this.ctx.repos.user.findByEmail(email);

    if (user) {
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
   * 取得使用者詳細資料
   */
  public async getUserById(id: string): Promise<UserResponseDto> {
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
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
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

  /**
   * 更新使用者
   */
  public async updateUser(
    id: string,
    data: UpdateUserRequestDto,
  ): Promise<void> {
    const user = await this.ctx.repos.user.findById(id);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    // 如果有更新角色，先確認角色存在
    if (data.roleId) {
      const role = await this.ctx.repos.role.findById(data.roleId);

      if (!role) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
      }
    }

    await this.ctx.repos.user.update(id, data);
  }

  /**
   * 刪除使用者
   */
  public async deleteUser(id: string): Promise<void> {
    const currentUser = this.ctx.currentUser;

    if (!currentUser) {
      throw new AppError(ErrorCode.UNAUTH);
    }

    // 不可刪除自己
    if (id === currentUser.id) {
      throw new AppError(ErrorCode.REQUEST_DATA, "無法刪除自己");
    }

    const user = await this.ctx.repos.user.findById(id);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    await this.ctx.repos.user.delete(id);
  }

  /**
   * 取得當前使用者詳細資訊
   */
  public async getMyUserInfo(): Promise<UserResponseDto> {
    const currentUser = this.ctx.currentUser;

    if (!currentUser) {
      throw new AppError(ErrorCode.UNAUTH);
    }

    const user = await this.ctx.repos.user.findById(currentUser.id);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
