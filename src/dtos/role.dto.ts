// src/dtos/role.dto.ts
import { Expose, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";

/**
 * 建立角色 Request DTO
 */
export class CreateRoleRequestDto {
  @IsString({ message: "角色名稱必須為字串" })
  @Length(2, 50, { message: "角色名稱長度需介於 2~50 字元" })
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 200, { message: "描述長度需介於 0~200 字元" })
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
  @IsString()
  @Length(0, 200, { message: "描述長度需介於 0~200 字元" })
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
 * 取得角色列表 Request DTO
 */
export class GetRoleListRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "page 必須為整數" })
  @Min(1, { message: "page 最小值為 1" })
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "limit 必須為整數" })
  @Min(1, { message: "limit 最小值為 1" })
  @Max(100, { message: "limit 最大值為 100" })
  limit = 20;
}

/**
 * 取得角色列表 Response DTO
 */
export class GetRoleListResponseDto {
  data!: RoleResponseDto[];

  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
