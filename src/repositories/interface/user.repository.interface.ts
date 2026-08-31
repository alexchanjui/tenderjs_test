// src/repositories/interface/user.repository.interface.ts
import type { User } from "@prisma/client";
import type { CreateUserDto, UpdateUserRequestDto } from "../../dtos/user.dto";

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAndCount(params: { skip?: number; take?: number }): Promise<[User[], number]>;
  update(id: string, data: UpdateUserRequestDto): Promise<void>;
  delete(id: string): Promise<void>;
}
