// src/dtos/role.dto.ts
import { Expose, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

/**
 * 建立角色 Request DTO
 */
export class CreateRoleRequestDto {
  @IsString({ message: "角色名稱必須為字串" })
  @Length(2, 50, { message: "角色名稱長度需介於 2~50 字元" })
  name!: string;

  @IsOptional()
  @IsString({ message: "角色說明必須為字串" })
  @Length(0, 200, { message: "角色說明長度需介於 0~200 字元" })
  description?: string;
}

/**
 * 更新角色 Request DTO
 */
export class UpdateRoleRequestDto {
  @IsOptional()
  @IsString({ message: "角色名稱必須為字串" })
  @Length(2, 50, { message: "角色名稱長度需介於 2~50 字元" })
  name?: string;

  @IsOptional()
  @IsString({ message: "角色說明必須為字串" })
  @Length(0, 200, { message: "角色說明長度需介於 0~200 字元" })
  description?: string;
}

/**
 * 角色 Response DTO
 */
export class RoleResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string | null;
}

/**
 * 角色詳細 Response DTO
 */
export class RoleDetailResponseDto extends RoleResponseDto {
  @Expose()
  permissionSettings!: FeaturePermissionSetting[];
}

// ==========================================
// 角色權限
// ==========================================

/**
 * 權限等級
 */
export enum PermissionAccessLevel {
  /** 不可使用 */
  NONE = "NONE",

  /** 僅允許檢視（GET） */
  VIEW = "VIEW",

  /** 允許檢視與編輯（GET、POST、PUT、DELETE） */
  EDIT = "EDIT",
}

/**
 * API 操作類型
 */
export enum PermissionActionType {
  GET = 0,
  POST = 1,
  PUT = 2,
  DELETE = 3,
}

/**
 * 功能權限設定
 */
export class FeaturePermissionSetting {
  @IsInt({ message: "功能代碼必須為整數" })
  featureCode!: number;

  @IsEnum(PermissionAccessLevel, {
    message: "權限等級必須為 NONE、VIEW 或 EDIT",
  })
  accessLevel!: PermissionAccessLevel;
}

/**
 * 更新角色權限 Request DTO
 */
export class UpdateRolePermissionsRequestDto {
  @IsArray({ message: "設定必須為陣列" })
  @ArrayMinSize(1, { message: "至少需要設定一個功能" })
  @ValidateNested({ each: true })
  @Type(() => FeaturePermissionSetting)
  settings!: FeaturePermissionSetting[];
}
