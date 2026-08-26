// src/services/role.service.ts
import { plainToInstance } from "class-transformer";
import {
  CreateRoleRequestDto,
  PermissionAccessLevel,
  PermissionActionType,
  RoleResponseDto,
  RoleDetailResponseDto,
  UpdateRolePermissionsRequestDto,
  UpdateRoleRequestDto,
} from "../dtos/role.dto";
import type {
  PaginationRequestDto,
  PaginationResponseDto,
} from "../dtos/pagination.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";
import { invalidateRolePermissions } from "../caches/role-permission.cache";

export class RoleService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立角色
   */
  public async createRole(
    data: CreateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const existingRole = await this.ctx.repos.role.findByName(data.name);

    if (existingRole) {
      throw new AppError(ErrorCode.DUPLICATE, "角色名稱已存在");
    }

    const role = await this.ctx.repos.role.create(data);

    return plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得角色列表
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

    return {
      data: plainToInstance(RoleResponseDto, roles, {
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
  public async getRoleById(id: string): Promise<RoleDetailResponseDto> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    const allPermissions = await this.ctx.repos.permission.findAll();

    const featureCodes = [...new Set(allPermissions.map((p) => p.featureCode))];

    const permissionSettings = featureCodes.map((featureCode) => {
      const permissions = role.rolePermissions
        .map((rp) => rp.permission)
        .filter((p) => p.featureCode === featureCode);

      let accessLevel = PermissionAccessLevel.NONE;

      if (permissions.some((p) => p.actionType !== PermissionActionType.GET)) {
        accessLevel = PermissionAccessLevel.EDIT;
      } else if (permissions.length > 0) {
        accessLevel = PermissionAccessLevel.VIEW;
      }

      return {
        featureCode,
        accessLevel,
      };
    });

    return plainToInstance(
      RoleDetailResponseDto,
      {
        ...role,
        permissionSettings,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  /**
   * 更新角色
   */
  public async updateRole(
    id: string,
    data: UpdateRoleRequestDto,
  ): Promise<void> {
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
   * 刪除角色
   */
  public async deleteRole(id: string): Promise<void> {
    const role = await this.ctx.repos.role.findById(id);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    await this.ctx.repos.role.delete(id);

    // 清除角色權限 Redis 快取
    await invalidateRolePermissions(id);
  }

  /**
   * 更新角色權限
   */
  public async updateRolePermissions(
    roleId: string,
    dto: UpdateRolePermissionsRequestDto,
  ): Promise<void> {
    const role = await this.ctx.repos.role.findById(roleId);

    if (!role) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "角色不存在");
    }

    const permissionIds = new Set<number>();

    for (const setting of dto.settings) {
      const permissions = await this.ctx.repos.permission.findByFeatureCode(
        setting.featureCode,
      );

      switch (setting.accessLevel) {
        case PermissionAccessLevel.NONE:
          break;

        case PermissionAccessLevel.VIEW:
          permissions
            .filter(
              (permission) =>
                permission.actionType === PermissionActionType.GET,
            )
            .forEach((permission) => {
              permissionIds.add(permission.id);
            });
          break;

        case PermissionAccessLevel.EDIT:
          permissions.forEach((permission) => {
            permissionIds.add(permission.id);
          });
          break;
      }
    }

    await this.ctx.repos.role.updatePermissions(
      roleId,
      Array.from(permissionIds),
    );

    // 清除角色權限 Redis 快取
    await invalidateRolePermissions(roleId);
  }
}
