// src/repositories/prisma/stop.prisma.repository.ts
import type { Prisma, Stop } from "@prisma/client";
import type { IStopRepository } from "../interface/stop.repository.interface";
import { StopResponseDto } from "../../dtos/stop.dto";
import { IDbContext } from "../../types/db.context";

export class StopPrismaRepository implements IStopRepository {
  constructor(private readonly ctx: IDbContext) {}

  public async create(data: Prisma.StopCreateInput): Promise<StopResponseDto> {
    return this.ctx.prisma.stop.create({ data });
  }

  public async findById(id: number): Promise<StopResponseDto | null> {
    return this.ctx.prisma.stop.findUnique({
      where: { id },
    });
  }

  public async findAndCount(params: { skip?: number; take?: number }): Promise<[Stop[], number]> {
    return this.ctx.prisma.$transaction([
      this.ctx.prisma.stop.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { updatedAt: "desc" },
      }),
      this.ctx.prisma.stop.count(),
    ]);
  }

  public async update(id: number, data: Prisma.StopUpdateInput): Promise<void> {
    await this.ctx.prisma.stop.update({ where: { id }, data });
  }

  public async delete(id: number): Promise<void> {
    await this.ctx.prisma.stop.delete({ where: { id } });
  }
}
