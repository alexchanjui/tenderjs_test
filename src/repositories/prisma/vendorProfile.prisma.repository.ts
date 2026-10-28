// src/repositories/prisma/vendorProfile.prisma.repository.ts
import type { UpdateVendorProfileRequestDto } from "../../dtos/vendorProfile.dto";
import type { IDbContext } from "../../types/db.context";
import type {
  IVendorProfileRepository,
  VendorProfileWithBanners,
} from "../interface/vendorProfile.repository.interface";

export class VendorProfilePrismaRepository implements IVendorProfileRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 取得業者詳細資訊
   */
  public async findByNodeId(nodeId: string): Promise<VendorProfileWithBanners | null> {
    return this.ctx.prisma.vendorProfile.findUnique({
      where: {
        nodeId,
      },
      include: {
        banners: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  }

  /**
   * 新增或更新業者詳細資訊
   */
  public async upsert(
    nodeId: string,
    data: UpdateVendorProfileRequestDto,
  ): Promise<VendorProfileWithBanners> {
    const { banners, ...profileData } = data;

    return this.ctx.prisma.$transaction(async (tx) => {
      // 新增或更新業者詳細資訊
      const profile = await tx.vendorProfile.upsert({
        where: {
          nodeId,
        },
        create: {
          nodeId,
          ...profileData,
        },
        update: profileData,
      });

      // 更新主視覺橫幅
      await tx.vendorBanner.deleteMany({
        where: {
          vendorProfileId: profile.id,
        },
      });

      if (banners.length > 0) {
        await tx.vendorBanner.createMany({
          data: banners.map((banner, index) => ({
            vendorProfileId: profile.id,
            imageUrl: banner.imageUrl,
            sortOrder: banner.sortOrder ?? index + 1,
          })),
        });
      }

      return tx.vendorProfile.findUniqueOrThrow({
        where: {
          id: profile.id,
        },
        include: {
          banners: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });
    });
  }
}
