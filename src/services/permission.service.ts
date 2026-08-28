// src/services/permission.service.ts
import { plainToInstance } from "class-transformer";
import { IServiceContext } from "../types/service.context";
import {
  PaginationRequestDto,
  PaginationResponseDto,
} from "../dtos/pagination.dto";
import {
  CreatePermissionRequestDto,
  PermissionResponseDto,
} from "../dtos/permission.dto";
import cacheInitService from "./cache-init.service";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";

export class PermissionService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立權限
   */
  public async createPermission(
    data: CreatePermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    const permission = await this.ctx.repos.permission.findByName(data.name);

    if (permission) {
      throw new AppError(ErrorCode.DUPLICATE, "權限名稱已存在");
    }

    const newPermission = await this.ctx.repos.permission.create(data);

    // 重新載入 Permission 本機快取
    await cacheInitService.reloadPermissionRules();

    return plainToInstance(PermissionResponseDto, newPermission, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得權限列表
   */
  public async getPermissions(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<PermissionResponseDto>> {
    const { page, limit } = dto;

    const skip = (page - 1) * limit;

    const [permissions, total] = await this.ctx.repos.permission.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: plainToInstance(PermissionResponseDto, permissions, {
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
   * 取得權限詳細資訊
   */
  public async getPermissionById(id: number): Promise<PermissionResponseDto> {
    const permission = await this.ctx.repos.permission.findById(id);

    if (!permission) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "權限不存在");
    }

    return plainToInstance(PermissionResponseDto, permission, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新權限
   */
  public async updatePermission(
    id: number,
    data: Partial<CreatePermissionRequestDto>,
  ): Promise<PermissionResponseDto> {
    const permission = await this.ctx.repos.permission.findById(id);

    if (!permission) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "權限不存在");
    }

    const newPermission = await this.ctx.repos.permission.update(id, data);

    // 重新載入 Permission 本機快取
    await cacheInitService.reloadPermissionRules();

    return plainToInstance(PermissionResponseDto, newPermission, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 刪除權限
   */
  public async deletePermission(id: number): Promise<void> {
    const permission = await this.ctx.repos.permission.findById(id);

    if (!permission) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "權限不存在");
    }

    await this.ctx.repos.permission.delete(id);

    // 重新載入 Permission 本機快取
    await cacheInitService.reloadPermissionRules();
  }
}
