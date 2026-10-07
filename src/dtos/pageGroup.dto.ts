// src/dtos/pageGroup.dto.ts
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Length, Min } from "class-validator";

/**
 * 建立頁面群組 Request DTO
 */
export class CreatePageGroupRequestDto {
  @Type(() => Number)
  @IsInt({ message: "頁面群組代碼必須為整數" })
  pageGroupCode!: number;

  @IsString({ message: "頁面群組名稱必須為字串" })
  @Length(2, 50, { message: "頁面群組名稱長度需介於 2~50 字元" })
  name!: string;

  @IsOptional()
  @IsString({ message: "頁面群組描述必須為字串" })
  description?: string;

  @IsString({ message: "頁面路徑必須為字串" })
  routePath!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "排序必須為整數" })
  @Min(0, { message: "排序不可小於 0" })
  sortOrder?: number;

  @IsOptional()
  @IsBoolean({ message: "啟用狀態必須為布林值" })
  isActive?: boolean;
}

/**
 * 更新頁面群組 Request DTO
 */
export class UpdatePageGroupRequestDto {
  @IsOptional()
  @IsString({ message: "頁面群組名稱必須為字串" })
  @Length(2, 50, { message: "頁面群組名稱長度需介於 2~50 字元" })
  name?: string;

  @IsOptional()
  @IsString({ message: "頁面群組描述必須為字串" })
  description?: string;

  @IsOptional()
  @IsString({ message: "頁面路徑必須為字串" })
  routePath?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "排序必須為整數" })
  @Min(0, { message: "排序不可小於 0" })
  sortOrder?: number;

  @IsOptional()
  @IsBoolean({ message: "啟用狀態必須為布林值" })
  isActive?: boolean;
}

/**
 * 頁面群組 Response DTO
 */
export class PageGroupResponseDto {
  @Expose()
  pageGroupCode!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string | null;

  @Expose()
  routePath!: string | null;

  @Expose()
  sortOrder!: number;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
