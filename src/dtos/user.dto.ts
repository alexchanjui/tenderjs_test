// src/dtos/user.dto.ts
import { Expose, Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  IsDefined,
  ValidateIf,
} from "class-validator";

/**
 * 建立使用者 Request DTO
 */
export class CreateUserRequestDto {
  @IsString({ message: "使用者名稱必須為字串" })
  @Length(2, 20, {
    message: "使用者名稱長度需介於 2~20 字元",
  })
  username!: string;

  @IsString({ message: "暱稱必須為字串" })
  @Length(2, 20, {
    message: "暱稱長度需介於 2~20 字元",
  })
  nickname!: string;

  @IsEmail({}, { message: "Email 格式錯誤" })
  email!: string;

  @IsString({ message: "密碼必須為字串" })
  @Length(8, 16, {
    message: "密碼長度需介於 8~16 字元",
  })
  password!: string;

  @IsOptional()
  @IsUUID("4", { message: "角色 ID 格式錯誤" })
  roleId?: string;

  @IsDefined({ message: "業者 ID 為必填" })
  @ValidateIf((_, value) => value !== null)
  @IsUUID("4", { message: "業者 ID 格式錯誤" })
  vendorId!: string | null;
}

/**
 * 更新使用者 Request DTO
 */
export class UpdateUserRequestDto {
  @IsOptional()
  @IsString({ message: "使用者名稱必須為字串" })
  @Length(2, 20, {
    message: "使用者名稱長度需介於 2~20 字元",
  })
  username!: string;

  @IsOptional()
  @IsString({ message: "暱稱必須為字串" })
  @Length(2, 20, {
    message: "暱稱長度需介於 2~20 字元",
  })
  nickname!: string;

  @IsOptional()
  @IsEmail({}, { message: "Email 格式錯誤" })
  email!: string;

  @IsOptional()
  @IsUUID("4", { message: "角色 ID 格式錯誤" })
  roleId?: string;

  @IsOptional()
  @IsUUID("4", { message: "業者 ID 格式錯誤" })
  vendorId?: string | null;

  @IsOptional()
  @IsBoolean({ message: "啟用狀態必須為布林值" })
  isActive?: boolean;
}

/**
 * 使用者角色資訊 DTO
 */
class UserRoleDto {
  @Expose()
  name!: string;

  @Expose()
  description!: string;
}

/**
 * 業者資訊 DTO
 */
export class UserVendorResponseDto {
  @Expose()
  name!: string;

  @Expose()
  code!: string;
}

/**
 * 使用者 Response DTO
 */
export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Expose()
  nickname!: string;

  @Expose()
  email!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  roleId!: string | null;

  @Expose()
  @Type(() => UserRoleDto)
  role!: UserRoleDto | null;

  @Expose()
  vendorId!: string | null;

  @Expose()
  @Type(() => UserVendorResponseDto)
  vendor!: UserVendorResponseDto | null;

  @Expose()
  pageCodes!: number[];
}
