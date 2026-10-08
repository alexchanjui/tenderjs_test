// src/services/vendor.service.ts
import { plainToInstance } from "class-transformer";
import { invalidateVendorPermissions } from "../caches/vendorPermission.cache";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  CreateVendorRequestDto,
  UpdateVendorPermissionsRequestDto,
  UpdateVendorRequestDto,
  VendorResponseDto,
} from "../dtos/vendor.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { VendorWithPermissions } from "../repositories/interface/vendor.repository.interface";
import type { IServiceContext } from "../types/service.context";

export class VendorService {
  constructor(private readonly ctx: IServiceContext) {}

  public async createVendor(data: CreateVendorRequestDto): Promise<VendorResponseDto> {
    this.assertPlatform();

    const existing = await this.ctx.repos.vendor.findByCode(data.code);
    if (existing) {
      throw new AppError(ErrorCode.DUPLICATE, "業者代碼已存在");
    }

    const vendor = await this.ctx.repos.vendor.create(data);
    const created = await this.ctx.repos.vendor.findById(vendor.id);

    if (!created) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    return this.toResponse(created);
  }

  public async getVendors(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<VendorResponseDto>> {
    this.assertPlatform();

    const { page, limit } = dto;
    const [vendors, total] = await this.ctx.repos.vendor.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: vendors.map((vendor) => this.toResponse(vendor)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getVendorById(id: string): Promise<VendorResponseDto> {
    this.assertPlatform();

    const vendor = await this.ctx.repos.vendor.findById(id);
    if (!vendor) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    return this.toResponse(vendor);
  }

  public async updateVendor(id: string, data: UpdateVendorRequestDto): Promise<void> {
    this.assertPlatform();

    const vendor = await this.ctx.repos.vendor.findById(id);
    if (!vendor) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    await this.ctx.repos.vendor.update(id, data);
  }

  public async batchDeleteVendor(ids: string[]): Promise<void> {
    this.assertPlatform();

    const vendors = await Promise.all(ids.map((id) => this.ctx.repos.vendor.findById(id)));

    if (vendors.some((vendor) => !vendor)) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    const hasRelatedData = vendors.some(
      (vendor) => vendor && (vendor._count.users > 0 || vendor._count.roles > 0),
    );

    if (hasRelatedData) {
      throw new AppError(ErrorCode.REQUEST_DATA, "業者仍有帳號或角色資料，無法刪除");
    }

    await this.ctx.repos.vendor.batchDelete(ids);

    await Promise.all(ids.map((id) => invalidateVendorPermissions(id)));
  }

  public async getVendorPermissions(id: string): Promise<number[]> {
    this.assertPlatform();

    const vendor = await this.ctx.repos.vendor.findById(id);
    if (!vendor) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    return vendor.vendorPermissions.map((item) => item.permissionId);
  }

  public async updateVendorPermissions(
    id: string,
    dto: UpdateVendorPermissionsRequestDto,
  ): Promise<void> {
    this.assertPlatform();

    const vendor = await this.ctx.repos.vendor.findById(id);
    if (!vendor) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    const permissionCount = await this.ctx.prisma.permission.count({
      where: {
        id: { in: dto.permissionIds },
        isActive: true,
        isRequired: true,
      },
    });

    if (permissionCount !== dto.permissionIds.length) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "權限不存在");
    }

    await this.ctx.repos.vendor.updatePermissions(id, dto.permissionIds);
    await invalidateVendorPermissions(id);
  }

  private assertPlatform(): void {
    if (!this.ctx.currentUser || this.ctx.currentUser.userType !== "PLATFORM") {
      throw new AppError(ErrorCode.PERMISSION);
    }
  }

  private toResponse(vendor: VendorWithPermissions): VendorResponseDto {
    return plainToInstance(
      VendorResponseDto,
      {
        ...vendor,
        permissionIds: vendor.vendorPermissions.map((item) => item.permissionId),
        userCount: vendor._count.users,
        roleCount: vendor._count.roles,
      },
      { excludeExtraneousValues: true },
    );
  }
}
