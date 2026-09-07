// src/repositories/interface/stop.repository.interface.ts
import type { Stop } from "@prisma/client";
import { StopResponseDto } from "../../dtos/stop.dto";
import type { Prisma } from "@prisma/client";

export interface IStopRepository {
  create(data: Prisma.StopCreateInput): Promise<StopResponseDto>;
  findById(id: number): Promise<StopResponseDto | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[Stop[], number]>;
  update(id: number, data: Prisma.StopUpdateInput): Promise<void>;
  delete(id: number): Promise<void>;
}
