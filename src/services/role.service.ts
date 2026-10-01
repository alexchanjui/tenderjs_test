// src/services/role.service.ts
import { plainToInstance } from "class-transformer";
import {
  CreateRoleRequestDto,
  PermissionAccessLevel,
  RoleResponseDto,
  UpdateRoleFeaturesRequestDto,
  UpdateRoleRequestDto,
} from "../dtos/role.dto";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";
import { invalidateRoleFeatures } from "../caches/role-feature.cache";

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
   * 取得角色列表 (分頁)
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

    const features = await this.ctx.repos.feature.findAll();

    const data = roles.map((role) => ({
      ...role,
      userCount: role._count.users,
      permissionSettings: this.getPermissionSettings(
        role.roleFeatures,
        features.map((feature) => feature.featureCode),
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

    const features = await this.ctx.repos.feature.findAll();

    return plainToInstance(
      RoleResponseDto,
      {
        ...role,
        userCount: role._count.users,
        permissionSettings: this.getPermissionSettings(
          role.roleFeatures,
          features.map((feature) => feature.featureCode),
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
   * 更新角色權限
   */
  public async updateRoleFeatures(
    roleId: string,
    dto: UpdateRoleFeaturesRequestDto,
  ): Promise<void> {
    const role = await this.ctx.repos.role.findById(roleId);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    const features = await this.ctx.repos.feature.findAll();
    const featureCodes = new Set(features.map((feature) => feature.featureCode));

    // 只允許設定存在且啟用的功能
    const invalidSetting = dto.settings.find((setting) => !featureCodes.has(setting.featureCode));

    if (invalidSetting) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "頁面功能不存在");
    }

    // NONE 不需要寫入 RoleFeature
    const roleFeatures = dto.settings
      .filter((setting) => setting.accessLevel !== PermissionAccessLevel.NONE)
      .map((setting) => ({
        featureCode: setting.featureCode,
        accessLevel: setting.accessLevel,
      }));

    await this.ctx.repos.role.updateFeatures(roleId, roleFeatures);

    // 清除角色權限 Redis 快取
    await invalidateRoleFeatures(roleId);
  }

  /**
   * 計算角色權限設定
   */
  private getPermissionSettings(
    roleFeatures: {
      featureCode: number;
      accessLevel: string;
    }[],
    featureCodes: number[],
  ) {
    return featureCodes.map((featureCode) => {
      const roleFeature = roleFeatures.find(
        (roleFeature) => roleFeature.featureCode === featureCode,
      );

      return {
        featureCode,
        accessLevel: roleFeature?.accessLevel ?? PermissionAccessLevel.NONE,
      };
    });
  }
}
