// src/dtos/user.dto.ts
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(2, 20)
  username!: string;

  @IsString()
  @Length(2, 20)
  nickname!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 16)
  password!: string;

  @IsIn(["PLATFORM", "VENDOR"])
  userType!: string;

  @IsOptional()
  @IsUUID("4")
  vendorId?: string;

  @IsOptional()
  @IsUUID("4")
  roleId?: string;
}

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  @Length(2, 20)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  nickname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUUID("4")
  roleId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class UserRoleDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  scope!: string;
}

export class UserPageDto {
  @Expose()
  pageId!: number;

  @Expose()
  pageCode!: number;
}

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  username!: string;

  @Expose()
  nickname!: string;

  @Expose()
  email!: string;

  @Expose()
  userType!: string;

  @Expose()
  vendorId!: string | null;

  @Expose()
  isActive!: boolean;

  @Expose()
  roleId!: string | null;

  @Expose()
  @Type(() => UserRoleDto)
  role!: UserRoleDto | null;

  @Expose()
  @Type(() => UserPageDto)
  pages!: UserPageDto[];

  @Expose()
  permissionIds!: number[];

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
