// src/repositories/prisma/vendor-profile.prisma.repository.ts
import type { UpdateVendorProfileRequestDto } from "../../dtos/vendor-profile.dto";
import type { IDbContext } from "../../types/db.context";
import type {
  IVendorProfileRepository,
  VendorProfileWithBanners,
} from "../interface/vendor-profile.repository.interface";

export class VendorProfilePrismaRepository implements IVendorProfileRepository {
  constructor(private readonly ctx: IDbContext) {}

  /**
   * 取得業者品牌資訊
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
   * 更新業者品牌資訊
   */
  public async update(
    nodeId: string,
    data: UpdateVendorProfileRequestDto,
  ): Promise<VendorProfileWithBanners> {
    const { banners, ...profileData } = data;

    return this.ctx.prisma.$transaction(async (tx) => {
      const profile = await tx.vendorProfile.update({
        where: {
          nodeId,
        },
        data: profileData,
      });

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
