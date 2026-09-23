// src/services/permission.service.ts
import { plainToInstance } from "class-transformer";
import { IServiceContext } from "../types/service.context";
import { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  CreatePermissionRequestDto,
  PermissionResponseDto,
  UpdatePermissionRequestDto,
} from "../dtos/permission.dto";
import cacheInitService from "./cache-init.service";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";

export class PermissionService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立權限
   */
  public async createPermission(data: CreatePermissionRequestDto): Promise<PermissionResponseDto> {
    // 檢查名稱
    const permissionByName = await this.ctx.repos.permission.findByName(data.name);

    if (permissionByName) {
      throw new AppError(ErrorCode.DUPLICATE, "權限名稱已存在");
    }

    // 建立權限
    const newPermission = await this.ctx.repos.permission.create(data);

    // 重新載入權限快取
    await cacheInitService.reloadPermissionRules();

    return plainToInstance(PermissionResponseDto, newPermission, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 取得權限列表 (分頁)
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
   * 取得所有權限
   */
  public async getAllPermissions(): Promise<PermissionResponseDto[]> {
    const permissions = await this.ctx.repos.permission.findAll();

    return plainToInstance(PermissionResponseDto, permissions, {
      excludeExtraneousValues: true,
    });
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
    data: UpdatePermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    const permission = await this.ctx.repos.permission.findById(id);

    if (!permission) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "權限不存在");
    }

    // 排序有異動時，調整其他權限排序
    if (data.sortOrder !== undefined && data.sortOrder !== permission.sortOrder) {
      data.sortOrder = await this.ctx.repos.permission.adjustSortOrder(
        id,
        permission.sortOrder,
        data.sortOrder,
      );
    }

    const newPermission = await this.ctx.repos.permission.update(id, data);

    // 重新載入權限快取
    await cacheInitService.reloadPermissionRules();

    return plainToInstance(PermissionResponseDto, newPermission, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 批次刪除權限
   */
  public async batchDeletePermission(ids: number[]): Promise<void> {
    await this.ctx.repos.permission.batchDelete(ids);

    // 重新載入權限快取
    await cacheInitService.reloadPermissionRules();
  }
}
