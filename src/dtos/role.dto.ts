// src/dtos/role.dto.ts
import { Expose } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID, Length } from "class-validator";

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

  @IsOptional()
  @IsUUID("4", { message: "業者 ID 格式錯誤" })
  vendorId?: string | null;
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
  userCount!: number;

  @Expose()
  pageCodes!: number[];

  @Expose()
  vendorId!: string | null;

  @Expose()
  isVendorAdmin!: boolean;

  @Expose()
  isActive!: boolean;
}

/**
 * 更新角色頁面權限 Request DTO
 */
export class UpdateRolePagesRequestDto {
  @IsArray({ message: "頁面代碼必須為陣列" })
  @IsInt({ each: true, message: "頁面代碼必須為整數" })
  pageCodes!: number[];
}
