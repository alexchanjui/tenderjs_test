// src/repositories/interface/pageGroup.repository.interface.ts
import type { PageGroup } from "@prisma/client";
import type {
  CreatePageGroupRequestDto,
  UpdatePageGroupRequestDto,
} from "../../dtos/pageGroup.dto";

export interface IPageGroupRepository {
  create(data: CreatePageGroupRequestDto): Promise<PageGroup>;
  findAll(): Promise<PageGroup[]>;
  findByCode(pageGroupCode: number): Promise<PageGroup | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[PageGroup[], number]>;
  update(pageGroupCode: number, data: UpdatePageGroupRequestDto): Promise<void>;
  batchDelete(pageGroupCodes: number[]): Promise<void>;
}
