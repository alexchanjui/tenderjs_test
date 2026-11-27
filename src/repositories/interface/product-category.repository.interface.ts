// src/repositories/interface/product-category.repository.interface.ts
import type { ProductCategory } from "@prisma/client";
import type {
  CreateProductCategoryRequestDto,
  UpdateProductCategoryRequestDto,
} from "../../dtos/product-category.dto";

export interface IProductCategoryRepository {
  findAndCount(params: {
    skip: number;
    take: number;
    keyword?: string;
  }): Promise<[ProductCategory[], number]>;
  create(data: CreateProductCategoryRequestDto): Promise<void>;
  update(id: number, data: UpdateProductCategoryRequestDto): Promise<void>;
  delete(id: number): Promise<void>;
}
