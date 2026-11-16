// src/repositories/interface/product-category.repository.interface.ts
import type { ProductCategory } from "@prisma/client";
import type {
  CreateProductCategoryRequestDto,
  UpdateProductCategoryRequestDto,
} from "../../dtos/product-category.dto";

export interface IProductCategoryRepository {
  findAll(): Promise<ProductCategory[]>;
  findAndCount(params: {
    skip: number;
    take: number;
    keyword?: string;
  }): Promise<[ProductCategory[], number]>;
  findById(id: number): Promise<ProductCategory | null>;
  create(data: CreateProductCategoryRequestDto): Promise<void>;
  update(id: number, data: UpdateProductCategoryRequestDto): Promise<void>;
  batchDelete(ids: number[]): Promise<void>;
}
