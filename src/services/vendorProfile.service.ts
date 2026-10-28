// src/services/vendorProfile.service.ts
import { plainToInstance } from "class-transformer";
import { UpdateVendorProfileRequestDto, VendorProfileResponseDto } from "../dtos/vendorProfile.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class VendorProfileService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得目前操作的 Node ID
   */
  private getCurrentNodeId(): string {
    const currentNodeId = this.ctx.currentNodeId;

    if (!currentNodeId) {
      throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    }

    return currentNodeId;
  }

  /**
   * 取得業者詳細資訊
   */
  public async getVendorProfile(): Promise<VendorProfileResponseDto | null> {
    const currentNodeId = this.getCurrentNodeId();

    const profile = await this.ctx.repos.vendorProfile.findByNodeId(currentNodeId);

    if (!profile) {
      return null;
    }

    return plainToInstance(VendorProfileResponseDto, profile, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * 更新業者詳細資訊
   */
  public async updateVendorProfile(data: UpdateVendorProfileRequestDto): Promise<void> {
    const currentNodeId = this.getCurrentNodeId();

    await this.ctx.repos.vendorProfile.upsert(currentNodeId, data);
  }
}
