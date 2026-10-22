// src/repositories/interface/faq.repository.interface.ts
import type { Faq, FaqCategory } from "@prisma/client";

import type {
  CreateFaqCategoryRequestDto,
  CreateFaqRequestDto,
  UpdateFaqCategoryRequestDto,
  UpdateFaqRequestDto,
} from "../../dtos/faq.dto";

export interface IFaqRepository {
  // 問答分類
  createCategory(vendorProfileId: string, data: CreateFaqCategoryRequestDto): Promise<FaqCategory>;
  findAllCategories(vendorProfileId: string): Promise<FaqCategory[]>;
  findCategoryById(id: number): Promise<FaqCategory | null>;
  updateCategory(id: number, data: UpdateFaqCategoryRequestDto): Promise<void>;
  deleteCategory(id: number): Promise<void>;

  // 問答
  createQa(data: CreateFaqRequestDto): Promise<Faq>;
  findAllQa(categoryId: number): Promise<Faq[]>;
  findQaById(id: number): Promise<Faq | null>;
  updateQa(id: number, data: UpdateFaqRequestDto): Promise<void>;
  deleteQa(id: number): Promise<void>;
}
