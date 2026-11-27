// src/repositories/interface/page.repository.interface.ts
import type { Page } from "@prisma/client";
import type { CreatePageRequestDto, UpdatePageRequestDto } from "../../dtos/page.dto";

export interface IPageRepository {
  findAndCount(params: {
    skip?: number;
    take?: number;
    keyword?: string;
  }): Promise<[Page[], number]>;
  findById(id: number): Promise<Page | null>;
  findByCode(pageCode: number): Promise<Page | null>;
  findByCodes(pageCodes: number[]): Promise<Page[]>;
  create(data: CreatePageRequestDto): Promise<void>;
  update(id: number, data: UpdatePageRequestDto): Promise<void>;
  delete(id: number): Promise<void>;
}
