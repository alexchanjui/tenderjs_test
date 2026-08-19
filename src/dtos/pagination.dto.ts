// src/dtos/pagination.dto.ts
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

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
}

/**
 * 分頁查詢 Response DTO
 */
export interface PaginationResponseDto<T> {
  data: T[];
  meta: PaginationMeta;
}
