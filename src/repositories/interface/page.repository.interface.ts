// src/repositories/interface/page.repository.interface.ts
import type { Page } from "@prisma/client";
import type { CreatePageRequestDto, UpdatePageRequestDto } from "../../dtos/page.dto";

export interface IPageRepository {
  create(data: CreatePageRequestDto): Promise<Page>;
  findAll(): Promise<Page[]>;
  findByCode(pageCode: number): Promise<Page | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[Page[], number]>;
  update(pageCode: number, data: UpdatePageRequestDto): Promise<void>;
  batchDelete(pageCodes: number[]): Promise<void>;
}
