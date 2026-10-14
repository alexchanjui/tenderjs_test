// src/dtos/vendor.dto.ts
import { Expose, Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";

/**
 * 首位業者管理員資訊 DTO
 */
export class CreateVendorAdminDto {
  @IsString({ message: "管理員帳號必須為字串" })
  @IsNotEmpty({ message: "管理員帳號不得為空" })
  @Length(2, 50, { message: "管理員帳號長度需介於 2~50 字元" })
  account!: string;

  @IsString({ message: "管理員名稱必須為字串" })
  @IsNotEmpty({ message: "管理員名稱不得為空" })
  @Length(2, 50, { message: "管理員名稱長度需介於 2~50 字元" })
  username!: string;

  @IsEmail({}, { message: "Email 格式錯誤" })
  email!: string;

  @IsString({ message: "密碼必須為字串" })
  @IsNotEmpty({ message: "密碼不得為空" })
  @Length(6, 100, { message: "密碼長度需介於 6~100 字元" })
  password!: string;
}

/**
 * 建立業者 Request DTO
 */
export class CreateVendorRequestDto {
  @IsString({ message: "業者代碼必須為字串" })
  @Length(2, 50, { message: "業者代碼長度需介於 2~50 字元" })
  code!: string;

  @IsString({ message: "業者名稱必須為字串" })
  @Length(2, 100, { message: "業者名稱長度需介於 2~100 字元" })
  name!: string;

  @IsOptional()
  @IsString({ message: "業者說明必須為字串" })
  @Length(0, 200, { message: "業者說明長度需介於 0~200 字元" })
  description?: string;

  @ValidateNested()
  @Type(() => CreateVendorAdminDto)
  admin!: CreateVendorAdminDto;
}

/**
 * 更新業者 Request DTO
 */
export class UpdateVendorRequestDto {
  @IsOptional()
  @IsString({ message: "業者名稱必須為字串" })
  @Length(2, 100, { message: "業者名稱長度需介於 2~100 字元" })
  name?: string;

  @IsOptional()
  @IsString({ message: "業者說明必須為字串" })
  @Length(0, 200, { message: "業者說明長度需介於 0~200 字元" })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: "啟用狀態必須為布林值" })
  isActive?: boolean;
}

/**
 * 更新業者頁面權限 Request DTO
 */
export class UpdateVendorPagesRequestDto {
  @IsArray({ message: "頁面代碼必須為陣列" })
  @IsInt({ each: true, message: "頁面代碼必須為整數" })
  pageCodes!: number[];
}

/**
 * 業者 Response DTO
 */
export class VendorResponseDto {
  @Expose()
  id!: string;

  @Expose()
  code!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string | null;

  @Expose()
  isActive!: boolean;

  @Expose()
  @Transform(({ obj }) =>
    obj.nodePages
      ? obj.nodePages.map((nodePage: { page: { pageCode: number } }) => nodePage.page.pageCode)
      : [],
  )
  pageCodes!: number[];
}
