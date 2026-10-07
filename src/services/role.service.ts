// src/services/role.service.ts
import { plainToInstance } from "class-transformer";
import { invalidateRolePageGroups } from "../caches/rolePageGroup.cache";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  CreateRoleRequestDto,
  PermissionAccessLevel,
  RoleResponseDto,
  UpdateRolePageGroupsRequestDto,
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

    const pageGroups = await this.ctx.repos.pageGroup.findAll();

    const data = roles.map((role) => ({
      ...role,
      userCount: role._count.users,
      permissionSettings: this.getPermissionSettings(
        role.rolePageGroups,
        pageGroups.map((pageGroup) => pageGroup.pageGroupCode),
      ),
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

    const pageGroups = await this.ctx.repos.pageGroup.findAll();

    return plainToInstance(
      RoleResponseDto,
      {
        ...role,
        userCount: role._count.users,
        permissionSettings: this.getPermissionSettings(
          role.rolePageGroups,
          pageGroups.map((pageGroup) => pageGroup.pageGroupCode),
        ),
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
   * 更新角色頁面群組權限
   */
  public async updateRolePageGroups(
    roleId: string,
    dto: UpdateRolePageGroupsRequestDto,
  ): Promise<void> {
    const role = await this.ctx.repos.role.findById(roleId);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    const pageGroups = await this.ctx.repos.pageGroup.findAll();
    const pageGroupCodes = new Set(pageGroups.map((pageGroup) => pageGroup.pageGroupCode));

    // 只允許設定存在且啟用的頁面群組
    const invalidSetting = dto.settings.find(
      (setting) => !pageGroupCodes.has(setting.pageGroupCode),
    );

    if (invalidSetting) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面群組不存在");
    }

    // NONE 不需要寫入 RolePageGroup
    const rolePageGroups = dto.settings
      .filter((setting) => setting.accessLevel !== PermissionAccessLevel.NONE)
      .map((setting) => ({
        pageGroupCode: setting.pageGroupCode,
        accessLevel: setting.accessLevel,
      }));

    await this.ctx.repos.role.updatePageGroups(roleId, rolePageGroups);

    // 清除角色頁面群組權限 Redis 快取
    await invalidateRolePageGroups(roleId);
  }

  /**
   * 計算角色權限設定
   */
  private getPermissionSettings(
    rolePageGroups: {
      pageGroupCode: number;
      accessLevel: string;
    }[],
    pageGroupCodes: number[],
  ) {
    return pageGroupCodes.map((pageGroupCode) => {
      const rolePageGroup = rolePageGroups.find(
        (rolePageGroup) => rolePageGroup.pageGroupCode === pageGroupCode,
      );

      return {
        pageGroupCode,
        accessLevel: rolePageGroup?.accessLevel ?? PermissionAccessLevel.NONE,
      };
    });
  }
}
