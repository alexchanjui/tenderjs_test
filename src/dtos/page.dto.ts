// src/dtos/page.dto.ts
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Length } from "class-validator";

/**
 * 建立頁面 Request DTO
 */
export class CreatePageRequestDto {
  @Type(() => Number)
  @IsInt({ message: "頁面代碼必須為整數" })
  pageCode!: number;

  @IsString({ message: "頁面名稱必須為字串" })
  @Length(2, 50, { message: "頁面名稱長度需介於 2~50 字元" })
  name!: string;

  @IsOptional()
  @IsString({ message: "頁面描述必須為字串" })
  description?: string;

  @IsString({ message: "頁面路徑必須為字串" })
  routePath!: string;

  @IsOptional()
  @IsBoolean({ message: "啟用狀態必須為布林值" })
  isActive?: boolean;
}

/**
 * 更新頁面 Request DTO
 */
export class UpdatePageRequestDto {
  @IsOptional()
  @IsString({ message: "頁面名稱必須為字串" })
  @Length(2, 50, { message: "頁面名稱長度需介於 2~50 字元" })
  name?: string;

  @IsOptional()
  @IsString({ message: "頁面描述必須為字串" })
  description?: string;

  @IsOptional()
  @IsString({ message: "頁面路徑必須為字串" })
  routePath?: string;

  @IsOptional()
  @IsBoolean({ message: "啟用狀態必須為布林值" })
  isActive?: boolean;
}

/**
 * 頁面 Response DTO
 */
export class PageResponseDto {
  @Expose()
  pageCode!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string | null;

  @Expose()
  routePath!: string | null;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
