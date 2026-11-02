// src/repositories/interface/vendor.repository.interface.ts
import type { Node, NodePage, Prisma } from "@prisma/client";
import type {
  CreateVendorRequestDto,
  UpdateVendorProfileRequestDto,
  UpdateVendorRequestDto,
} from "../../dtos/vendor.dto";

/**
 * 包含頁面權限的業者資料
 */
export type VendorWithPages = Node & {
  nodePages: (NodePage & {
    page: {
      pageCode: number;
    };
  })[];
};

/**
 * 包含主視覺橫幅的業者品牌資訊
 */
export type VendorProfileWithBanners = Prisma.VendorProfileGetPayload<{
  include: {
    banners: true;
  };
}>;

export interface IVendorRepository {
  createWithAdmin(data: CreateVendorRequestDto): Promise<void>;
  findById(id: string): Promise<VendorWithPages | null>;
  findByCode(code: string): Promise<Node | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[VendorWithPages[], number]>;
  update(id: string, data: UpdateVendorRequestDto): Promise<void>;
  batchDelete(ids: string[]): Promise<number>;
  updatePages(nodeId: string, pages: { pageId: number }[]): Promise<void>;
  findProfileByNodeId(nodeId: string): Promise<VendorProfileWithBanners | null>;
  updateProfile(
    nodeId: string,
    data: UpdateVendorProfileRequestDto,
  ): Promise<VendorProfileWithBanners>;
}
