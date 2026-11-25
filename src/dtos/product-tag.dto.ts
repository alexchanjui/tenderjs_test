// src/dtos/product-tag.dto.ts
import { Expose, Transform } from "class-transformer";
import { IsBoolean, Length, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * 建立產品標籤 Request DTO
 */
export class CreateProductTagRequestDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @Length(2, 20, { message: "標籤名稱需介於 2～20 個字元" })
  name!: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(500, { message: "標籤描述最多 500 個字元" })
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 更新產品標籤 Request DTO
 */
export class UpdateProductTagRequestDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @Length(2, 20, { message: "標籤名稱需介於 2～20 個字元" })
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MaxLength(500, { message: "標籤描述最多 500 個字元" })
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 產品標籤 Response DTO
 */
export class ProductTagResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  isActive!: boolean;
}
