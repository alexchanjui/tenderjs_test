// src/dtos/import.dto.ts

/**
 * 匯入錯誤資訊
 */
export class ImportErrorDto {
  row!: number;
  message!: string;
}

/**
 * 匯入結果
 */
export class ImportResultDto {
  totalCount!: number;
  successCount!: number;
  failedCount!: number;
  errors!: ImportErrorDto[];
}
