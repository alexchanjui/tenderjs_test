// src/services/user.service.ts
import bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import { PermissionAccessLevel, PermissionSettingResponse } from "../dtos/role.dto";
import { UserResponseDto, type CreateUserDto, type UpdateUserRequestDto } from "../dtos/user.dto";
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
  public async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const { username, nickname, email, password } = data;

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
      nickname,
      email,
      password: hashedPassword,
    });

    // 4. DTO 轉換
    return plainToInstance(UserResponseDto, newUser, {
      excludeExtraneousValues: true,
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
   *
   * 根據所有啟用中的頁面，以及使用者所屬角色的頁面權限，
   * 整理各頁面的權限等級：
   * - NONE：沒有該頁面的權限
   * - VIEW：具有檢視權限
   * - EDIT：具有編輯權限
   */
  public async getMyUserInfo(): Promise<UserResponseDto> {
    const id = this.ctx.currentUser?.id || "";

    const user = await this.ctx.repos.user.findById(id);

    if (!user) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
    }

    // 取得所有啟用中的頁面
    const pages = await this.ctx.repos.page.findAll();

    // 整理使用者所屬角色在各頁面下的權限等級
    const permissionSettings: PermissionSettingResponse[] = pages.map((page) => {
      const rolePage = user.role?.rolePages.find((rolePage) => rolePage.pageId === page.id);

      return {
        pageId: page.id,
        pageCode: page.pageCode,
        accessLevel: (rolePage?.accessLevel ?? PermissionAccessLevel.NONE) as PermissionAccessLevel,
      };
    });

    return plainToInstance(
      UserResponseDto,
      {
        ...user,
        permissionSettings,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
