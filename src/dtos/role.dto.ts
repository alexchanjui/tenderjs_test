// src/docs/role.dto.ts
import { Expose, Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";

export class CreateRoleRequestDto {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

  @IsIn(["PLATFORM", "VENDOR"])
  scope!: string;

  @IsOptional()
  @IsUUID("4")
  vendorId?: string;
}

export class UpdateRoleRequestDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class RolePageResponseDto {
  @Expose()
  pageId!: number;

  @Expose()
  pageCode!: number;
}

export class RoleResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string | null;

  @Expose()
  scope!: string;

  @Expose()
  vendorId!: string | null;

  @Expose()
  isSystem!: boolean;

  @Expose()
  isActive!: boolean;

  @Expose()
  userCount!: number;

  @Expose()
  @Type(() => RolePageResponseDto)
  pages!: RolePageResponseDto[];

  @Expose()
  permissionIds!: number[];
}

export class UpdateRolePagesRequestDto {
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  pageIds!: number[];
}

export class UpdateRolePermissionsRequestDto {
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  permissionIds!: number[];
}
