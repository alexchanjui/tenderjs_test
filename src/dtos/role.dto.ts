// src/dtos/role.dto.ts
import { Expose, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
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

  @IsOptional()
  @IsBoolean({ message: "啟用狀態必須為布林值" })
  isActive?: boolean;
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

  @Expose()
  isActive!: boolean;

  @Expose()
  userCount!: number;

  @Expose()
  permissionSettings!: PermissionSettingResponse[];
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
export class PermissionSetting {
  @Type(() => Number)
  @IsInt({ message: "頁面代碼必須為整數" })
  pageCode!: number;

  @IsEnum(PermissionAccessLevel, {
    message: "權限層級格式錯誤",
  })
  accessLevel!: PermissionAccessLevel;
}
/**
 * 頁面權限 Response DTO
 */
export class PermissionSettingResponse {
  @Expose()
  pageId!: number;

  @Expose()
  pageCode!: number;

  @Expose()
  accessLevel!: PermissionAccessLevel;
}

/**
 * 更新角色權限 Request DTO
 */
export class UpdateRolePermissionsRequestDto {
  @IsArray({ message: "設定必須為陣列" })
  @ArrayMinSize(1, { message: "至少需要設定一個功能" })
  @ValidateNested({ each: true })
  @Type(() => PermissionSetting)
  settings!: PermissionSetting[];
}
