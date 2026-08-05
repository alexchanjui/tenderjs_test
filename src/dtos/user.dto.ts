// src/dtos/user.dto.ts
import { IsString, IsEmail, Length } from "class-validator";

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
