// src/services/role.service.ts
import { plainToInstance } from "class-transformer";
import { invalidateRolePages } from "../caches/rolePage.cache";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  CreateRoleRequestDto,
  PermissionAccessLevel,
  RoleResponseDto,
  UpdateRolePermissionsRequestDto,
  UpdateRoleRequestDto,
} from "../dtos/role.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class RoleService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立角色
   */
  public async createRole(data: CreateRoleRequestDto): Promise<RoleResponseDto> {
    const role = await this.ctx.repos.role.findByName(data.name);

    if (role) {
      throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");
    }

    const newRole = await this.ctx.repos.role.create(data);

    return plainToInstance(RoleResponseDto, newRole, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得角色列表（分頁）
   */
  public async getRoles(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<RoleResponseDto>> {
    const { page, limit } = dto;

    const skip = (page - 1) * limit;

    const [roles, total] = await this.ctx.repos.role.findAndCount({
      skip,
      take: limit,
    });

    const pages = await this.ctx.repos.page.findAll();

    const data = roles.map((role) => ({
      ...role,
      userCount: role._count.users,
      permissionSettings: this.getPermissionSettings(role.rolePages, pages),
    }));

    return {
      data: plainToInstance(RoleResponseDto, data, {
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
   * 取得角色詳細資訊
   */
  public async getRoleById(id: string): Promise<RoleResponseDto> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    const pages = await this.ctx.repos.page.findAll();

    return plainToInstance(
      RoleResponseDto,
      {
        ...role,
        userCount: role._count.users,
        permissionSettings: this.getPermissionSettings(role.rolePages, pages),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  /**
   * 更新角色
   */
  public async updateRole(id: string, data: UpdateRoleRequestDto): Promise<void> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    if (data.name && data.name !== role.name) {
      const existingRole = await this.ctx.repos.role.findByName(data.name);

      if (existingRole) {
        throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");
      }
    }

    await this.ctx.repos.role.update(id, data);
  }

  /**
   * 批次刪除角色
   */
  public async batchDeleteRole(ids: string[]): Promise<void> {
    const userCount = await this.ctx.repos.role.countUsersByRoleIds(ids);

    if (userCount > 0) {
      throw new Error(`選取的角色仍有 ${userCount} 位使用者使用，無法刪除。`);
    }

    await this.ctx.repos.role.batchDelete(ids);
  }

  /**
   * 更新角色頁面權限
   */
  public async updateRolePermissions(
    roleId: string,
    dto: UpdateRolePermissionsRequestDto,
  ): Promise<void> {
    const role = await this.ctx.repos.role.findById(roleId);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    const pages = await this.ctx.repos.page.findAll();
    const pageIds = new Set(pages.map((page) => page.id));

    // 只允許設定存在且啟用的頁面
    const invalidSetting = dto.settings.find((setting) => !pageIds.has(setting.pageId));

    if (invalidSetting) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面不存在");
    }

    if (new Set(dto.settings.map((setting) => setting.pageId)).size !== dto.settings.length) {
      throw new AppError(ErrorCode.REQUEST_DATA, "頁面權限不可重複設定");
    }

    // NONE 不需要寫入 RolePage
    const rolePages = dto.settings
      .filter((setting) => setting.accessLevel !== PermissionAccessLevel.NONE)
      .map((setting) => ({
        pageId: setting.pageId,
        accessLevel: setting.accessLevel,
      }));

    await this.ctx.repos.role.updatePermissions(roleId, rolePages);

    // 清除角色頁面權限 Redis 快取
    await invalidateRolePages(roleId);
  }

  /**
   * 計算角色權限設定
   */
  private getPermissionSettings(
    rolePages: {
      pageId: number;
      accessLevel: string;
    }[],
    pages: { id: number; pageCode: number }[],
  ) {
    return pages.map((page) => {
      const rolePage = rolePages.find((rolePage) => rolePage.pageId === page.id);

      return {
        pageId: page.id,
        pageCode: page.pageCode,
        accessLevel: rolePage?.accessLevel ?? PermissionAccessLevel.NONE,
      };
    });
  }
}
