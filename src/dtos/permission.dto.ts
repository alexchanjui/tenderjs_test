// src/dtos/permission.dto.ts
import { Expose, Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsInt,
  Length,
  IsBoolean,
} from "class-validator";

/**
 * 建立權限 Request DTO
 */
export class CreatePermissionRequestDto {
  @Type(() => Number)
  @IsInt({ message: "功能代碼必須為整數" })
  featureCode!: number;

  @IsString({ message: "權限名稱必須為字串" })
  @Length(2, 50, { message: "權限名稱長度需介於 2~50 字元" })
  name!: string;

  @IsString({ message: "API 路徑必須為字串" })
  apiPath!: string;

  @Type(() => Number)
  @IsInt({ message: "API 操作類型必須為整數" })
  actionType!: number;

  @IsOptional()
  @IsString({ message: "權限說明必須為字串" })
  @Length(0, 200, { message: "權限說明長度需介於 0~200 字元" })
  description?: string;
}

/**
 * 更新權限 Request DTO
 */
export class UpdatePermissionRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "功能代碼必須為整數" })
  featureCode?: number;

  @IsOptional()
  @IsString({ message: "權限名稱必須為字串" })
  @Length(2, 50, { message: "權限名稱長度需介於 2~50 字元" })
  name?: string;

  @IsOptional()
  @IsString({ message: "API 路徑必須為字串" })
  apiPath?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "API 操作類型必須為整數" })
  actionType?: number;

  @IsOptional()
  @IsBoolean({ message: "狀態必須為布林值" })
  isActive?: boolean;

  @IsOptional()
  @IsString({ message: "權限說明必須為字串" })
  @Length(0, 200, { message: "權限說明長度需介於 0~200 字元" })
  description?: string;
}

/**
 * 權限 Response DTO
 */
export class PermissionResponseDto {
  @Expose()
  id!: number;

  @Expose()
  featureCode!: number;

  @Expose()
  name!: string;

  @Expose()
  apiPath!: string;

  @Expose()
  actionType!: number;

  @Expose()
  isActive!: boolean;

  @Expose()
  description!: string | null;
}
