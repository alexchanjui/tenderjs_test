// src/dtos/user.dto.ts
import { Expose, Type } from "class-transformer";
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

/**
 * 建立使用者 Request DTO
 */
export class CreateUserDto {
  @IsString({ message: "使用者名稱必須為字串" })
  @Length(2, 20, {
    message: "使用者名稱長度需介於 2~20 字元",
  })
  username!: string;

  @IsEmail({}, { message: "Email 格式錯誤" })
  email!: string;

  @IsString({ message: "密碼必須為字串" })
  @Length(8, 16, {
    message: "密碼長度需介於 8~16 字元",
  })
  password!: string;
}

/**
 * 使用者 Response DTO
 */
export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Expose()
  email!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

/**
 * 取得使用者列表 Request DTO
 */
export class GetUserListRequestDto {
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
 * 取得使用者列表 Response DTO
 */
export class GetUserListResponseDto {
  data!: UserResponseDto[];

  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
