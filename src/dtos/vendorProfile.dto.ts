// src/dtos/vendorProfile.dto.ts
import { Expose, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";

/**
 * 業者主視覺橫幅 Request DTO
 */
export class VendorBannerRequestDto {
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

/**
 * 更新業者資料 Request DTO
 */
export class UpdateVendorProfileRequestDto {
  @IsString()
  @IsNotEmpty()
  brandName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  brandImage?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== "")
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => VendorBannerRequestDto)
  banners!: VendorBannerRequestDto[];
}

/**
 * 業者主視覺橫幅 Response DTO
 */
export class VendorBannerResponseDto {
  @Expose()
  id!: string;

  @Expose()
  imageUrl!: string;

  @Expose()
  sortOrder!: number;
}

/**
 * 業者資料 Response DTO
 */
export class VendorProfileResponseDto {
  @Expose()
  id!: string;

  @Expose()
  brandName!: string;

  @Expose()
  description!: string | null;

  @Expose()
  brandImage!: string | null;

  @Expose()
  phone!: string | null;

  @Expose()
  email!: string | null;

  @Expose()
  address!: string | null;

  @Expose()
  @Type(() => VendorBannerResponseDto)
  banners!: VendorBannerResponseDto[];
}
