// src/dtos/pagination.dto.ts
import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

/**
 * 分頁資訊
 */
interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 分頁查詢 Request DTO
 */
export class PaginationRequestDto {
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

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString({ message: "keyword 必須為字串" })
  @MaxLength(20, { message: "keyword 最多 20 個字元" })
  keyword?: string;
}

/**
 * 分頁查詢 Response DTO
 */
export interface PaginationResponseDto<T> {
  data: T[];
  meta: PaginationMeta;
}
