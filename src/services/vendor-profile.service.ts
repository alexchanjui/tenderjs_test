// src/services/vendor-profile.service.ts
import { plainToInstance } from "class-transformer";
import {
  UpdateVendorProfileRequestDto,
  VendorProfileResponseDto,
} from "../dtos/vendor-profile.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class VendorProfileService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得業者品牌資訊
   */
  public async getVendorProfile(): Promise<VendorProfileResponseDto> {
    const nodeId = this.getCurrentNodeId();

    const profile = await this.ctx.repos.vendorProfile.findByNodeId(nodeId);

    if (!profile) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者資料不存在");
    }

    return plainToInstance(VendorProfileResponseDto, profile, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新業者品牌資訊
   */
  public async updateVendorProfile(data: UpdateVendorProfileRequestDto): Promise<void> {
    const nodeId = this.getCurrentNodeId();

    const profile = await this.ctx.repos.vendorProfile.findByNodeId(nodeId);

    if (!profile) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "業者資料不存在");
    }

    await this.ctx.repos.vendorProfile.update(nodeId, data);
  }

  /**
   * 取得目前操作的 Node ID
   */
  private getCurrentNodeId(): string {
    const nodeId = this.ctx.currentNodeId;

    if (!nodeId) {
      throw new AppError(ErrorCode.DATA_NOT_FOUND, "目前操作的業者不存在");
    }

    return nodeId;
  }
}
