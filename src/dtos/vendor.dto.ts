// src/dtos/vendor.dto.ts
import { Expose } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class CreateVendorRequestDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsString()
  @Length(2, 50)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: "業者代碼僅能包含英數字、底線與連字號",
  })
  code!: string;
}

export class UpdateVendorRequestDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateVendorPermissionsRequestDto {
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  permissionIds!: number[];
}

export class VendorResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  code!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  permissionIds!: number[];

  @Expose()
  userCount!: number;

  @Expose()
  roleCount!: number;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
