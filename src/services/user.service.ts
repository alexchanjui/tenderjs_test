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

  /**
   * 取得目前登入使用者
   */
  private getCurrentUser() {
    const currentUser = this.ctx.currentUser;

    if (!currentUser) {
      throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    }

    return currentUser;
  }

  /**
   * 取得實際操作的 Node ID
   */
  private getTargetNodeId(nodeId?: string): string {
    const currentUser = this.getCurrentUser();

    return currentUser.nodeType === "VENDOR" ? currentUser.nodeId : (nodeId ?? currentUser.nodeId);
  }

  /**
   * 建立使用者
   */
  public async createUser(data: CreateUserRequestDto): Promise<void> {
    const { account, username, email, password, nodeId, roleId } = data;
    const targetNodeId = this.getTargetNodeId(nodeId);

    const user = await this.ctx.repos.user.findByEmail(email);

    if (user) {
      throw new AppError(ErrorCode.ACCOUNT_EXIST);
    }

    // 確認角色存在且與使用者屬於相同節點
    if (roleId) {
      const role = await this.ctx.repos.role.findById(roleId);

      if (!role) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
      }

      if (role.nodeId !== targetNodeId) {
        throw new AppError(ErrorCode.REQUEST_DATA, "使用者與角色必須屬於相同節點");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立使用者
    await this.ctx.repos.user.create({
      account,
      username,
      email,
      password: hashedPassword,
      nodeId: targetNodeId,
      roleId,
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
    const { page, limit, nodeId } = dto;
    const skip = (page - 1) * limit;
    const targetNodeId = this.getTargetNodeId(nodeId);

    const [users, total] = await this.ctx.repos.user.findAndCount({
      skip,
      take: limit,
      nodeId: targetNodeId,
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

    // 確認角色存在且與使用者屬於相同節點
    if (data.roleId) {
      const role = await this.ctx.repos.role.findById(data.roleId);

      if (!role) {
        throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
      }

      if (role.nodeId !== user.nodeId) {
        throw new AppError(ErrorCode.REQUEST_DATA, "使用者與角色必須屬於相同節點");
      }
    }

    // 更新使用者
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
