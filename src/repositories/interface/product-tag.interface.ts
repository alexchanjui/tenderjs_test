// src/repositories/interface/product-tag.repository.interface.ts
import type { ProductTag } from "@prisma/client";
import type {
  CreateProductTagRequestDto,
  UpdateProductTagRequestDto,
} from "../../dtos/product-tag.dto";

export interface IProductTagRepository {
  findAndCount(params: {
    skip?: number;
    take?: number;
    keyword?: string;
  }): Promise<[ProductTag[], number]>;
  create(data: CreateProductTagRequestDto): Promise<void>;
  update(id: number, data: UpdateProductTagRequestDto): Promise<void>;
  delete(id: number): Promise<void>;
}
