// src/repositories/interface/page.repository.interface.ts
import type { Page } from "@prisma/client";
import type { CreatePageRequestDto, UpdatePageRequestDto } from "../../dtos/page.dto";

export interface IPageRepository {
  create(data: CreatePageRequestDto): Promise<Page>;
  findAll(): Promise<Page[]>;
  findById(id: number): Promise<Page | null>;
  findByCode(pageCode: number): Promise<Page | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[Page[], number]>;
  update(id: number, data: UpdatePageRequestDto): Promise<void>;
  batchDelete(ids: number[]): Promise<void>;
}
