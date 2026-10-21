// src/dtos/faq.dto.ts
import { Expose } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

/**
 * 新增問答分類 Request DTO
 */
export class CreateFaqCategoryRequestDto {
  @IsUUID("4", { message: "節點 ID 格式錯誤" })
  nodeId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 更新問答分類 Request DTO
 */
export class UpdateFaqCategoryRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 問答分類 Response DTO
 */
export class FaqCategoryResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  sortOrder!: number;

  @Expose()
  isActive!: boolean;
}

/**
 * 新增問答 Request DTO
 */
export class CreateFaqRequestDto {
  @IsUUID("4", { message: "節點 ID 格式錯誤" })
  nodeId!: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 更新問答 Request DTO
 */
export class UpdateFaqRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 問答 Response DTO
 */
export class FaqResponseDto {
  @Expose()
  id!: string;

  @Expose()
  categoryId!: string;

  @Expose()
  title!: string;

  @Expose()
  content!: string;

  @Expose()
  sortOrder!: number;

  @Expose()
  isActive!: boolean;
}
