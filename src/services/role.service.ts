// src/services/role.service.ts
import { plainToInstance } from "class-transformer";
import { invalidateRolePages } from "../caches/rolePage.cache";
import { invalidateRolePermissions } from "../caches/rolePermission.cache";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  CreateRoleRequestDto,
  RoleResponseDto,
  UpdateRolePagesRequestDto,
  UpdateRolePermissionsRequestDto,
  UpdateRoleRequestDto,
} from "../dtos/role.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class RoleService {
  constructor(private readonly ctx: IServiceContext) {}

  public async createRole(data: CreateRoleRequestDto): Promise<RoleResponseDto> {
    if (data.scope === "PLATFORM" && data.vendorId) {
      throw new AppError(ErrorCode.REQUEST_DATA, "平台角色不可指定業者");
    }

    if (data.scope === "VENDOR" && !data.vendorId) {
      throw new AppError(ErrorCode.REQUEST_DATA, "業者角色必須指定業者");
    }

    const vendorId = data.scope === "VENDOR" ? data.vendorId! : null;
    const existing = await this.ctx.repos.role.findByName(data.name, data.scope, vendorId);

    if (existing) throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");

    const role = await this.ctx.repos.role.create(data);
    return plainToInstance(RoleResponseDto, role, { excludeExtraneousValues: true });
  }

  public async getRoles(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<RoleResponseDto>> {
    const { page, limit } = dto;
    const [roles, total] = await this.ctx.repos.role.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: plainToInstance(
        RoleResponseDto,
        roles.map((role) => this.toResponse(role)),
        { excludeExtraneousValues: true },
      ),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  public async getRoleById(id: string): Promise<RoleResponseDto> {
    const role = await this.ctx.repos.role.findById(id);
    if (!role) throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");

    return plainToInstance(RoleResponseDto, this.toResponse(role), {
      excludeExtraneousValues: true,
    });
  }

  public async updateRole(id: string, data: UpdateRoleRequestDto): Promise<void> {
    const role = await this.ctx.repos.role.findById(id);
    if (!role) throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");

    if (data.name && data.name !== role.name) {
      const existing = await this.ctx.repos.role.findByName(data.name, role.scope, role.vendorId);
      if (existing) throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");
    }

    await this.ctx.repos.role.update(id, data);
  }

  public async batchDeleteRole(ids: string[]): Promise<void> {
    const roles = await Promise.all(ids.map((id) => this.ctx.repos.role.findById(id)));
    if (roles.some((role) => role?.isSystem)) {
      throw new AppError(ErrorCode.REQUEST_DATA, "系統角色不可刪除");
    }

    const userCount = await this.ctx.repos.role.countUsersByRoleIds(ids);
    if (userCount > 0) {
      throw new AppError(ErrorCode.REQUEST_DATA, `選取的角色仍有 ${userCount} 位使用者使用`);
    }

    await this.ctx.repos.role.batchDelete(ids);
  }

  public async updateRolePages(roleId: string, dto: UpdateRolePagesRequestDto): Promise<void> {
    const role = await this.ctx.repos.role.findById(roleId);
    if (!role) throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");

    const count = await this.ctx.prisma.page.count({
      where: { id: { in: dto.pageIds }, isActive: true },
    });

    if (count !== dto.pageIds.length) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面不存在");
    }

    await this.ctx.repos.role.updatePages(roleId, dto.pageIds);
    await invalidateRolePages(roleId);
  }

  public async updateRolePermissions(
    roleId: string,
    dto: UpdateRolePermissionsRequestDto,
  ): Promise<void> {
    const role = await this.ctx.repos.role.findById(roleId);
    if (!role) throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");

    const permissionCount = await this.ctx.prisma.permission.count({
      where: { id: { in: dto.permissionIds }, isActive: true, isRequired: true },
    });

    if (permissionCount !== dto.permissionIds.length) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "權限不存在");
    }

    if (role.scope === "VENDOR") {
      if (!role.vendorId) throw new AppError(ErrorCode.REQUEST_DATA, "業者角色缺少 vendorId");

      const vendorPermissionCount = await this.ctx.prisma.vendorPermission.count({
        where: {
          vendorId: role.vendorId,
          permissionId: { in: dto.permissionIds },
        },
      });

      if (vendorPermissionCount !== dto.permissionIds.length) {
        throw new AppError(ErrorCode.PERMISSION, "角色權限超出業者可用權限");
      }
    }

    await this.ctx.repos.role.updatePermissions(roleId, dto.permissionIds);
    await invalidateRolePermissions(roleId);
  }

  private toResponse(role: {
    id: string;
    name: string;
    description: string | null;
    scope: string;
    vendorId: string | null;
    isSystem: boolean;
    isActive: boolean;
    rolePages: { pageId: number }[];
    rolePermissions: { permissionId: number }[];
    _count: { users: number };
  }) {
    return {
      ...role,
      userCount: role._count.users,
      pages: role.rolePages.map((item) => ({ pageId: item.pageId })),
      permissionIds: role.rolePermissions.map((item) => item.permissionId),
    };
  }
}
