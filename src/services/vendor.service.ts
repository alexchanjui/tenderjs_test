// src/services/vendor.service.ts
import { plainToInstance } from "class-transformer";
import type { PaginationRequestDto, PaginationResponseDto } from "../dtos/pagination.dto";
import {
  CreateVendorRequestDto,
  UpdateVendorRequestDto,
  VendorResponseDto,
} from "../dtos/vendor.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class VendorService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 建立業者
   */
  public async createVendor(data: CreateVendorRequestDto): Promise<void> {
    const vendor = await this.ctx.repos.vendor.findByCode(data.code);

    if (vendor) {
      throw new AppError(ErrorCode.DUPLICATE, "業者代碼已存在");
    }

    const accountUser = await this.ctx.repos.user.findByAccount(data.admin.account);

    if (accountUser) {
      throw new AppError(ErrorCode.ACCOUNT_EXIST, "管理員帳號已存在");
    }

    const emailUser = await this.ctx.repos.user.findByEmail(data.admin.email);

    if (emailUser) {
      throw new AppError(ErrorCode.ACCOUNT_EXIST, "管理員 Email 已存在");
    }

    await this.ctx.repos.vendor.createWithAdmin(data);
  }

  /**
   * 取得業者列表（分頁）
   */
  public async getVendors(
    dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<VendorResponseDto>> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;

    const [vendors, total] = await this.ctx.repos.vendor.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: plainToInstance(VendorResponseDto, vendors, {
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
   * 取得業者詳細資訊
   */
  public async getVendorById(id: string): Promise<VendorResponseDto> {
    const vendor = await this.ctx.repos.vendor.findById(id);

    if (!vendor) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    return plainToInstance(VendorResponseDto, vendor, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新業者
   */
  public async updateVendor(id: string, data: UpdateVendorRequestDto): Promise<void> {
    const vendor = await this.ctx.repos.vendor.findById(id);

    if (!vendor) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    await this.ctx.repos.vendor.update(id, data);
  }

  /**
   * 批次刪除業者
   */
  public async batchDeleteVendor(ids: string[]): Promise<void> {
    await this.ctx.repos.vendor.batchDelete(ids);
  }

  /**
   * 更新業者頁面權限
   */
  public async updateVendorPages(id: string, pageCodes: number[]): Promise<void> {
    const vendor = await this.ctx.repos.vendor.findById(id);

    if (!vendor) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者不存在");
    }

    const pages = await this.ctx.repos.page.findByCodes(pageCodes);

    if (pages.length !== pageCodes.length) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "部分頁面不存在");
    }

    await this.ctx.repos.vendor.updatePages(
      id,
      pages.map((page) => ({
        pageId: page.id,
      })),
    );
  }
}
