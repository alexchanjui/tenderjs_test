// src/dtos/vendor.dto.ts
import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, Length, IsArray, IsInt } from "class-validator";

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
    obj.vendorPages.map((vendorPage: { page: { pageCode: number } }) => vendorPage.page.pageCode),
  )
  pageCodes!: number[];
}
