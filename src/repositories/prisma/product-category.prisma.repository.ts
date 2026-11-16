// src/repositories/prisma/product-category.prisma.repository.ts
import type { ProductCategory } from "@prisma/client";
import type {
  CreateProductCategoryRequestDto,
  UpdateProductCategoryRequestDto,
} from "../../dtos/product-category.dto";
import type { IDbContext } from "../../types/db.context";
import type { IProductCategoryRepository } from "../interface/product-category.repository.interface";

export class ProductCategoryPrismaRepository implements IProductCategoryRepository {
  constructor(private readonly ctx: IDbContext) {}

  public findAll(): Promise<ProductCategory[]> {
    return this.ctx.prisma.productCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  public async findAndCount(params: {
    skip?: number;
    take?: number;
    keyword?: string;
  }): Promise<[ProductCategory[], number]> {
    const { skip, take, keyword } = params;

    const where = {
      ...(keyword && {
        name: {
          contains: keyword,
        },
      }),
    };

    return this.ctx.prisma.$transaction([
      this.ctx.prisma.productCategory.findMany({
        skip,
        take,
        where,
        orderBy: {
          name: "asc",
        },
      }),
      this.ctx.prisma.productCategory.count({
        where,
      }),
    ]);
  }

  public async findById(id: number): Promise<ProductCategory | null> {
    return this.ctx.prisma.productCategory.findUnique({
      where: { id },
    });
  }

  public async create(data: CreateProductCategoryRequestDto): Promise<void> {
    await this.ctx.prisma.productCategory.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  }

  public async update(id: number, data: UpdateProductCategoryRequestDto): Promise<void> {
    await this.ctx.prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  public async batchDelete(ids: number[]): Promise<void> {
    await this.ctx.prisma.productCategory.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
