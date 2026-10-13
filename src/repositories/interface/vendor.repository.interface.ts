// src/repositories/interface/vendor.repository.interface.ts
import type { Vendor, VendorPage } from "@prisma/client";
import type { CreateVendorRequestDto, UpdateVendorRequestDto } from "../../dtos/vendor.dto";

/**
 * 包含頁面權限的業者資料
 */
export type VendorWithPages = Vendor & {
  vendorPages: (VendorPage & {
    page: {
      pageCode: number;
    };
  })[];
};

export interface IVendorRepository {
  create(data: CreateVendorRequestDto): Promise<void>;
  findById(id: string): Promise<VendorWithPages | null>;
  findByCode(code: string): Promise<Vendor | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[VendorWithPages[], number]>;
  update(id: string, data: UpdateVendorRequestDto): Promise<void>;
  batchDelete(ids: string[]): Promise<number>;
  updatePages(vendorId: string, pages: { pageId: number }[]): Promise<void>;
}
