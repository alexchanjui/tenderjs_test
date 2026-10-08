// src/repositories/interface/vendor.repository.interface.ts
import type { Vendor, VendorPermission } from "@prisma/client";
import type { CreateVendorRequestDto, UpdateVendorRequestDto } from "../../dtos/vendor.dto";

export type VendorWithPermissions = Vendor & {
  vendorPermissions: VendorPermission[];
  _count: {
    users: number;
    roles: number;
  };
};

export interface IVendorRepository {
  create(data: CreateVendorRequestDto): Promise<Vendor>;
  findById(id: string): Promise<VendorWithPermissions | null>;
  findByCode(code: string): Promise<Vendor | null>;
  findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[VendorWithPermissions[], number]>;
  update(id: string, data: UpdateVendorRequestDto): Promise<void>;
  batchDelete(ids: string[]): Promise<void>;
  updatePermissions(vendorId: string, permissionIds: number[]): Promise<void>;
}
