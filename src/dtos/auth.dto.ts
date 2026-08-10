// src/dtos/auth.dto.ts
import { IsString, Length } from "class-validator";

/**
 * 登入 Request DTO
 */
export class LoginRequestDto {
  @IsString({ message: "帳號必須是字串" })
  @Length(2, 20, { message: "帳號長度需介於 2~20 字元" })
  username!: string;

  @IsString({ message: "密碼必須為字串" })
  @Length(8, 16, {
    message: "密碼長度需介於 8~16 字元",
  })
  password!: string;
}
