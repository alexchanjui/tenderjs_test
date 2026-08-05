// src/dtos/user.dto.ts
import { IsString, IsEmail, Length } from "class-validator";
import { Expose } from "class-transformer";

export class CreateUserDto {
  @IsString({ message: "使用者名稱必須為字串" })
  @Length(2, 20, { message: "使用者名稱長度需介於 2~20 字元" })
  username!: string;

  @IsEmail({}, { message: "Email 格式錯誤" })
  email!: string;

  @IsString()
  @Length(8, 16, { message: "密碼長度需介於 8~16 字元" })
  password!: string;
}

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
  createdAt!: Date | string;

  @Expose()
  updatedAt!: Date | string;

  static example() {
    return {
      id: "550e8400-e29b-41d4-a716-446655440000",
      username: "JohnDoe",
      email: "john.doe@example.com",
      isActive: true,
      createdAt: "2023-12-17T10:00:00.000Z",
      updatedAt: "2023-12-17T10:00:00.000Z",
    };
  }
}
