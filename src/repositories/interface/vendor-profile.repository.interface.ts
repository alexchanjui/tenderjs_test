// src/repositories/interface/vendor-profile.repository.interface.ts
import type { Prisma } from "@prisma/client";
import type { UpdateVendorProfileRequestDto } from "../../dtos/vendor-profile.dto";

/**
 * 包含主視覺橫幅的業者品牌資訊
 */
export type VendorProfileWithBanners = Prisma.VendorProfileGetPayload<{
  include: {
    banners: true;
  };
}>;

export interface IVendorProfileRepository {
  findByNodeId(nodeId: string): Promise<VendorProfileWithBanners | null>;
  update(nodeId: string, data: UpdateVendorProfileRequestDto): Promise<VendorProfileWithBanners>;
}
