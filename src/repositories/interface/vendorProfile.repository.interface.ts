// src/repositories/interface/vendorProfile.repository.interface.ts
import type { Prisma } from "@prisma/client";
import type { UpdateVendorProfileRequestDto } from "../../dtos/vendorProfile.dto";

export type VendorProfileWithBanners = Prisma.VendorProfileGetPayload<{
  include: {
    banners: true;
  };
}>;

export interface IVendorProfileRepository {
  findByNodeId(nodeId: string): Promise<VendorProfileWithBanners | null>;
  upsert(nodeId: string, data: UpdateVendorProfileRequestDto): Promise<VendorProfileWithBanners>;
}
