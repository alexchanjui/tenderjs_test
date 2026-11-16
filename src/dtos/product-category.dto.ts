// src/dtos/product-category.dto.ts
import { Expose, Transform } from "class-transformer";
import { IsBoolean, Length, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * 建立產品分類 Request DTO
 */
export class CreateProductCategoryRequestDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @Length(2, 20, { message: "分類名稱需介於 2～20 個字元" })
  name!: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(500, { message: "分類描述最多 500 個字元" })
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 更新產品分類 Request DTO
 */
export class UpdateProductCategoryRequestDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @Length(2, 20, { message: "分類名稱需介於 2～20 個字元" })
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MaxLength(500, { message: "分類描述最多 500 個字元" })
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 產品分類 Response DTO
 */
export class ProductCategoryResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  isActive!: boolean;
}
