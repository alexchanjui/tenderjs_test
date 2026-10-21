// src/services/vendorProfile.service.ts
import { plainToInstance } from "class-transformer";
import { UpdateVendorProfileRequestDto, VendorProfileResponseDto } from "../dtos/vendorProfile.dto";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";

export class VendorProfileService {
  constructor(private readonly ctx: IServiceContext) {}

  /**
   * 取得目前登入使用者
   */
  private getCurrentUser() {
    const currentUser = this.ctx.currentUser;

    if (!currentUser) {
      throw new AppError(ErrorCode.UNAUTH, "使用者未登入");
    }

    return currentUser;
  }

  /**
   * 取得實際操作的 Node ID
   */
  private getTargetNodeId(nodeId?: string): string {
    const currentUser = this.getCurrentUser();

    // 業者只能操作自己的資料
    if (currentUser.nodeType === "VENDOR") {
      return currentUser.nodeId;
    }

    // 營運可指定 Node，未指定則操作自己的 Node
    return nodeId ?? currentUser.nodeId;
  }

  /**
   * 取得業者詳細資訊
   */
  public async getVendorProfile(nodeId?: string): Promise<VendorProfileResponseDto | null> {
    const targetNodeId = this.getTargetNodeId(nodeId);

    const profile = await this.ctx.repos.vendorProfile.findByNodeId(targetNodeId);

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
    const targetNodeId = this.getTargetNodeId(data.nodeId);

    await this.ctx.repos.vendorProfile.upsert(targetNodeId, data);
  }
}
