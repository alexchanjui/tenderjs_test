import type { Node, NodePage } from "@prisma/client";
import type { CreateVendorRequestDto, UpdateVendorRequestDto } from "../../dtos/vendor.dto";

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

export interface IVendorRepository {
  createWithAdmin(data: CreateVendorRequestDto): Promise<void>;
  findById(id: string): Promise<VendorWithPages | null>;
  findByCode(code: string): Promise<Node | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[VendorWithPages[], number]>;
  update(id: string, data: UpdateVendorRequestDto): Promise<void>;
  batchDelete(ids: string[]): Promise<number>;
  updatePages(nodeId: string, pages: { pageId: number }[]): Promise<void>;
}
