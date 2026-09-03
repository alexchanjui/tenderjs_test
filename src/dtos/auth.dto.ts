// src/dtos/auth.dto.ts
import { Expose, Type } from "class-transformer";
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

  @IsString({ message: "驗證碼 ID 必須為字串" })
  captchaId!: string;

  @IsString({ message: "驗證碼必須為字串" })
  captcha!: string;
}

/**
 * 自動登入 Request DTO
 */
export class AutoLoginRequestDto {
  @IsString({ message: "帳號必須是字串" })
  @Length(2, 20, { message: "帳號長度需介於 2~20 字元" })
  username!: string;

  @IsString({ message: "密碼必須為字串" })
  @Length(8, 16, {
    message: "密碼長度需介於 8~16 字元",
  })
  password!: string;
}

/**
 * 登入使用者資訊 DTO
 */
export class LoginUserDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Expose()
  email!: string;
}

/**
 * 登入 Response DTO
 */
export class LoginResponseDto {
  @Expose()
  token!: string;

  @Expose()
  @Type(() => LoginUserDto)
  user!: LoginUserDto;
}
