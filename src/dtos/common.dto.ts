// src/dtos/common.dto.ts
import { IsArray, ArrayMinSize, IsString, IsInt } from "class-validator";

/**
 * 批次刪除字串 ID 的 DTO
 */
export class BatchDeleteStringIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ids!: string[];
}

/**
 * 批次刪除數字 ID 的 DTO
 */
export class BatchDeleteNumberIdsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  ids!: number[];
}
