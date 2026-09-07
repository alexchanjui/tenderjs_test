// src/dtos/stop.dto.ts
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsBoolean } from "class-validator";

/**
 * 新增/編輯招呼站 Request DTO
 */
export class SaveStopRequestDto {
  @IsNotEmpty({ message: "票機招呼站代碼不能為空" })
  @IsString({ message: "票機招呼站代碼必須為字串" })
  @MaxLength(10, { message: "票機招呼站代碼長度不能超過 10 字元" })
  bvStopCode!: string;

  @IsNotEmpty({ message: "業者招呼站代碼不能為空" })
  @IsString({ message: "業者招呼站代碼必須為字串" })
  @MaxLength(10, { message: "業者招呼站代碼長度不能超過 10 字元" })
  opStopCode!: string;

  @IsNotEmpty({ message: "招呼站全名不能為空" })
  @IsString({ message: "招呼站全名必須為字串" })
  @MaxLength(50, { message: "招呼站全名長度不能超過 50 字元" })
  fullName!: string;

  @IsNotEmpty({ message: "招呼站名稱不能為空" })
  @IsString({ message: "招呼站名稱必須為字串" })
  @MaxLength(50, { message: "招呼站名稱長度不能超過 50 字元" })
  name!: string;

  @IsNotEmpty({ message: "經度不能為空" })
  @IsString({ message: "經度必須為字串" })
  gpsX!: string;

  @IsNotEmpty({ message: "緯度不能為空" })
  @IsString({ message: "緯度必須為字串" })
  gpsY!: string;

  @IsOptional()
  @IsString({ message: "經度2必須為字串" })
  gps2X: string = "";

  @IsOptional()
  @IsString({ message: "緯度2必須為字串" })
  gps2Y: string = "";

  @IsOptional()
  @IsString({ message: "GPS 備註必須為字串" })
  gpsMemo: string = "";

  @IsOptional()
  @IsString({ message: "免費公車區碼必須為字串" })
  freeBusAreaCode: string = "";

  @IsOptional()
  @IsBoolean({ message: "啟用狀態必須為布林值" })
  isActive: boolean = true;
}

/**
 * 招呼站 Response DTO
 */
export class StopResponseDto {
  @Expose()
  id!: number;

  @Expose()
  bvStopCode!: string;

  @Expose()
  opStopCode!: string;

  @Expose()
  fullName!: string;

  @Expose()
  name!: string;

  @Expose()
  gpsX!: string;

  @Expose()
  gpsY!: string;

  @Expose()
  gps2X!: string;

  @Expose()
  gps2Y!: string;

  @Expose()
  gpsMemo!: string;

  @Expose()
  freeBusAreaCode!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  updatedAt!: Date;
}
