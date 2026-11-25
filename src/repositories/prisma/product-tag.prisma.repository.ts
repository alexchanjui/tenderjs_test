// src/repositories/prisma/product-tag.prisma.repository.ts
import type { ProductTag } from "@prisma/client";
import type {
  CreateProductTagRequestDto,
  UpdateProductTagRequestDto,
} from "../../dtos/product-tag.dto";
import type { IDbContext } from "../../types/db.context";
import type { IProductTagRepository } from "../interface/product-tag.interface";

export class ProductTagPrismaRepository implements IProductTagRepository {
  constructor(private readonly ctx: IDbContext) {}

  public async findAndCount(params: {
    skip?: number;
    take?: number;
    keyword?: string;
  }): Promise<[ProductTag[], number]> {
    const { skip, take, keyword } = params;

    const where = {
      ...(keyword && {
        name: {
          contains: keyword,
        },
      }),
    };

    return this.ctx.prisma.$transaction([
      this.ctx.prisma.productTag.findMany({
        skip,
        take,
        where,
        orderBy: {
          name: "asc",
        },
      }),
      this.ctx.prisma.productTag.count({
        where,
      }),
    ]);
  }

  public async create(data: CreateProductTagRequestDto): Promise<void> {
    await this.ctx.prisma.productTag.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  }

  public async update(id: number, data: UpdateProductTagRequestDto): Promise<void> {
    await this.ctx.prisma.productTag.update({
      where: { id },
      data,
    });
  }

  public async delete(id: number): Promise<void> {
    await this.ctx.prisma.productTag.delete({
      where: { id },
    });
  }
}
