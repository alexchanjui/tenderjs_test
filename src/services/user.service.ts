// src/services/user.service.ts
import bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import { UserResponseDto, type CreateUserDto, type UpdateUserRequestDto } from "../dtos/user.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class UserService {
  constructor(private readonly ctx: IServiceContext) {}

  private getCurrentUser() {
    const currentUser = this.ctx.currentUser;
    if (!currentUser) throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    return currentUser;
  }

  public async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    if (await this.ctx.repos.user.findByEmail(data.email)) {
      throw new AppError(ErrorCode.ACCOUNT_EXIST);
    }

    if (data.userType === "PLATFORM" && data.vendorId) {
      throw new AppError(ErrorCode.REQUEST_DATA, "平台帳號不可指定業者");
    }

    if (data.userType === "VENDOR" && !data.vendorId) {
      throw new AppError(ErrorCode.REQUEST_DATA, "業者帳號必須指定業者");
    }

    if (data.roleId) await this.validateRole(data.userType, data.vendorId ?? null, data.roleId);

    const user = await this.ctx.repos.user.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });

    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  public async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.ctx.repos.user.findById(id);
    if (!user) throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);

    return plainToInstance(UserResponseDto, this.toResponse(user), {
      excludeExtraneousValues: true,
    });
  }

  public async getUsers(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    const currentUser = this.getCurrentUser();
    const { page, limit } = dto;

    const [users, total] = await this.ctx.repos.user.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      ...(currentUser.userType === "VENDOR"
        ? { vendorId: currentUser.vendorId, userType: "VENDOR" }
        : {}),
    });

    return {
      data: plainToInstance(
        UserResponseDto,
        users.map((user) => this.toResponse(user)),
        { excludeExtraneousValues: true },
      ),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  public async updateUser(id: string, data: UpdateUserRequestDto): Promise<void> {
    const user = await this.ctx.repos.user.findById(id);
    if (!user) throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);

    const currentUser = this.getCurrentUser();
    if (currentUser.userType === "VENDOR" && user.vendorId !== currentUser.vendorId) {
      throw new AppError(ErrorCode.PERMISSION);
    }

    if (data.roleId) await this.validateRole(user.userType, user.vendorId, data.roleId);
    await this.ctx.repos.user.update(id, data);
  }

  public async batchDeleteUser(ids: string[]): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (ids.includes(currentUser.id)) {
      throw new AppError(ErrorCode.REQUEST_DATA, "無法刪除自己");
    }

    if (currentUser.userType === "VENDOR") {
      const count = await this.ctx.prisma.user.count({
        where: { id: { in: ids }, vendorId: currentUser.vendorId, userType: "VENDOR" },
      });
      if (count !== ids.length) throw new AppError(ErrorCode.PERMISSION);
    }

    const count = await this.ctx.repos.user.batchDelete(ids);
    if (count !== ids.length) throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);
  }

  public async getMyUserInfo(): Promise<UserResponseDto> {
    const currentUser = this.getCurrentUser();
    const user = await this.ctx.repos.user.findById(currentUser.id);
    if (!user) throw new AppError(ErrorCode.ACCOUNT_NOT_EXIST);

    return plainToInstance(UserResponseDto, this.toResponse(user), {
      excludeExtraneousValues: true,
    });
  }

  private async validateRole(userType: string, vendorId: string | null, roleId: string) {
    const role = await this.ctx.repos.role.findById(roleId);
    if (!role) throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");

    if (userType === "PLATFORM" && (role.scope !== "PLATFORM" || role.vendorId !== null)) {
      throw new AppError(ErrorCode.REQUEST_DATA, "平台帳號只能使用平台角色");
    }

    if (userType === "VENDOR" && (role.scope !== "VENDOR" || role.vendorId !== vendorId)) {
      throw new AppError(ErrorCode.REQUEST_DATA, "業者帳號只能使用同業者角色");
    }
  }

  private toResponse(user: {
    role: {
      rolePages: { pageId: number }[];
      rolePermissions: { permissionId: number }[];
    } | null;
    [key: string]: unknown;
  }) {
    return {
      ...user,
      pages: user.role?.rolePages.map((item) => ({ pageId: item.pageId })) ?? [],
      permissionIds: user.role?.rolePermissions.map((item) => item.permissionId) ?? [],
    };
  }
}
