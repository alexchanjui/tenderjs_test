// src/dtos/feature.dto.ts
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Length, Min } from "class-validator";

/**
 * 建立頁面功能 Request DTO
 */
export class CreateFeatureRequestDto {
  @Type(() => Number)
  @IsInt({ message: "功能代碼必須為整數" })
  featureCode!: number;

  @IsString({ message: "頁面名稱必須為字串" })
  @Length(2, 50, { message: "頁面名稱長度需介於 2~50 字元" })
  name!: string;

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
 * 更新頁面功能 Request DTO
 */
export class UpdateFeatureRequestDto {
  @IsOptional()
  @IsString({ message: "頁面名稱必須為字串" })
  @Length(2, 50, { message: "頁面名稱長度需介於 2~50 字元" })
  name?: string;

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
 * 頁面功能 Response DTO
 */
export class FeatureResponseDto {
  @Expose()
  featureCode!: number;

  @Expose()
  name!: string;

  @Expose()
  routePath!: string;

  @Expose()
  sortOrder!: number;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
