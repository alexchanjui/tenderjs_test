// src/services/user.service.ts
import bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  UserResponseDto,
  type CreateUserRequestDto,
  type UpdateUserRequestDto,
} from "../dtos/user.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class UserService {
  constructor(private readonly ctx: IServiceContext) {}

  private getCurrentUser() {
    const currentUser = this.ctx.currentUser;

    if (!currentUser) {
      throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    }

    return currentUser;
  }

  /**
   * 建立使用者
   */
  public async createUser(data: CreateUserRequestDto): Promise<void> {
    const { account, username, email, password, vendorId } = data;

    const user = await this.ctx.repos.user.findByEmail(email);

    if (user) {
      throw new AppError(ErrorCode.ACCOUNT_EXIST);
    }

    if (vendorId) {
      const vendor = await this.ctx.repos.vendor.findById(vendorId);

      if (!vendor) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.ctx.repos.user.create({
      account,
      username,
      email,
      password: hashedPassword,
      vendorId,
    });
  }

  /**
   * 取得使用者詳細資訊
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
   * 取得使用者列表（分頁）
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
  public async updateUser(id: string, data: UpdateUserRequestDto): Promise<void> {
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
   * 批次刪除使用者
   */
  public async batchDeleteUser(ids: string[]): Promise<void> {
    const currentUser = this.getCurrentUser();

    if (ids.includes(currentUser.id)) {
      throw new AppError(ErrorCode.REQUEST_DATA, "無法刪除自己");
    }

    const count = await this.ctx.repos.user.batchDelete(ids);

    if (count !== ids.length) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }
  }

  /**
   * 取得當前使用者詳細資訊
   */
  public async getMyUserInfo(): Promise<UserResponseDto> {
    const currentUser = this.getCurrentUser();

    const user = await this.ctx.repos.user.findById(currentUser.id);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    const pageCodes = user.role?.rolePages.map((rolePage) => rolePage.page.pageCode) ?? [];

    return plainToInstance(
      UserResponseDto,
      {
        ...user,
        pageCodes,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
