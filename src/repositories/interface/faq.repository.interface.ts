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
  findCategoryById(id: string): Promise<FaqCategory | null>;
  updateCategory(id: string, data: UpdateFaqCategoryRequestDto): Promise<void>;
  deleteCategory(id: string): Promise<void>;

  // 問答
  createQa(data: CreateFaqRequestDto): Promise<Faq>;
  findAllQa(categoryId: string): Promise<Faq[]>;
  findQaById(id: string): Promise<Faq | null>;
  updateQa(id: string, data: UpdateFaqRequestDto): Promise<void>;
  deleteQa(id: string): Promise<void>;
}
