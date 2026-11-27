// src/repositories/prisma/page.prisma.repository.ts
import type { Page } from "@prisma/client";
import type { CreatePageRequestDto, UpdatePageRequestDto } from "../../dtos/page.dto";
import type { IDbContext } from "../../types/db.context";
import type { IPageRepository } from "../interface/page.repository.interface";

export class PagePrismaRepository implements IPageRepository {
  constructor(private readonly ctx: IDbContext) {}

  public async findAndCount(params: {
    skip: number;
    take: number;
    keyword?: string;
  }): Promise<[Page[], number]> {
    const { skip, take, keyword } = params;

    const where = {
      ...(keyword && {
        name: {
          contains: keyword,
        },
      }),
    };

    return this.ctx.prisma.$transaction([
      this.ctx.prisma.page.findMany({
        skip,
        take,
        where,
        orderBy: {
          name: "asc",
        },
      }),
      this.ctx.prisma.page.count({
        where,
      }),
    ]);
  }

  public async findById(id: number): Promise<Page | null> {
    return this.ctx.prisma.page.findUnique({
      where: { id },
    });
  }

  public async findByCode(pageCode: number): Promise<Page | null> {
    return this.ctx.prisma.page.findUnique({
      where: { pageCode },
    });
  }

  public async findByCodes(pageCodes: number[]): Promise<Page[]> {
    return this.ctx.prisma.page.findMany({
      where: {
        pageCode: {
          in: pageCodes,
        },
      },
    });
  }

  public async create(data: CreatePageRequestDto): Promise<void> {
    await this.ctx.prisma.page.create({
      data: {
        pageCode: data.pageCode,
        name: data.name,
        description: data.description,
        routePath: data.routePath,
        isActive: data.isActive ?? true,
      },
    });
  }

  public async update(id: number, data: UpdatePageRequestDto): Promise<void> {
    await this.ctx.prisma.page.update({
      where: { id },
      data,
    });
  }

  public async delete(id: number): Promise<void> {
    await this.ctx.prisma.page.delete({
      where: { id },
    });
  }
}
