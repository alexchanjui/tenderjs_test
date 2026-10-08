// src/repositories/prisma/vendor.prisma.repository.ts
import type { Vendor } from "@prisma/client";
import type { CreateVendorRequestDto, UpdateVendorRequestDto } from "../../dtos/vendor.dto";
import type { IDbContext } from "../../types/db.context";
import type {
  IVendorRepository,
  VendorWithPermissions,
} from "../interface/vendor.repository.interface";

export class VendorPrismaRepository implements IVendorRepository {
  constructor(private readonly ctx: IDbContext) {}

  public async create(data: CreateVendorRequestDto): Promise<Vendor> {
    return this.ctx.prisma.vendor.create({ data });
  }

  public async findAll(): Promise<VendorWithPermissions[]> {
    return this.ctx.prisma.vendor.findMany({
      include: {
        vendorPermissions: true,
        _count: {
          select: {
            users: true,
            roles: true,
          },
        },
      },
    });
  }

  public async findById(id: string): Promise<VendorWithPermissions | null> {
    return this.ctx.prisma.vendor.findUnique({
      where: { id },
      include: {
        vendorPermissions: true,
        _count: {
          select: {
            users: true,
            roles: true,
          },
        },
      },
    });
  }

  public async findByCode(code: string): Promise<Vendor | null> {
    return this.ctx.prisma.vendor.findUnique({
      where: { code },
    });
  }

  public async findAndCount(params: {
    skip?: number;
    take?: number;
  }): Promise<[VendorWithPermissions[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.vendor.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: {
          vendorPermissions: true,
          _count: {
            select: {
              users: true,
              roles: true,
            },
          },
        },
      }),
      this.ctx.prisma.vendor.count(),
    ]);
  }

  public async update(id: string, data: UpdateVendorRequestDto): Promise<void> {
    await this.ctx.prisma.vendor.update({
      where: { id },
      data,
    });
  }

  public async batchDelete(ids: string[]): Promise<void> {
    await this.ctx.prisma.vendor.deleteMany({
      where: { id: { in: ids } },
    });
  }

  public async updatePermissions(vendorId: string, permissionIds: number[]): Promise<void> {
    await this.ctx.prisma.$transaction(async (tx) => {
      await tx.vendorPermission.deleteMany({
        where: { vendorId },
      });

      if (permissionIds.length > 0) {
        await tx.vendorPermission.createMany({
          data: permissionIds.map((permissionId) => ({
            vendorId,
            permissionId,
          })),
        });
      }
    });
  }
}
