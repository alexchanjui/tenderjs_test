// src/dtos/user.dto.ts
import { Expose } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

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
