// src/dtos/auth.dto.ts
import { Expose, Type } from "class-transformer";
import { IsString, Length } from "class-validator";

export class LoginRequestDto {
  @IsString({ message: "帳號必須是字串" })
  @Length(2, 20, { message: "帳號長度需介於 2~20 字元" })
  username!: string;

  @IsString({ message: "密碼必須為字串" })
  @Length(8, 16, { message: "密碼長度需介於 8~16 字元" })
  password!: string;

  @IsString({ message: "驗證碼 ID 必須為字串" })
  captchaId!: string;

  @IsString({ message: "驗證碼必須為字串" })
  captcha!: string;
}

export class AutoLoginRequestDto {
  @IsString()
  @Length(2, 20)
  username!: string;

  @IsString()
  @Length(8, 16)
  password!: string;
}

export class LoginUserDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Expose()
  email!: string;

  @Expose()
  userType!: string;

  @Expose()
  vendorId!: string | null;

  @Expose()
  roleId!: string | null;
}

export class LoginResponseDto {
  @Expose()
  token!: string;

  @Expose()
  @Type(() => LoginUserDto)
  user!: LoginUserDto;
}
