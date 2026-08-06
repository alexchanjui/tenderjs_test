// src/repositories/interface/user.repository.interface.ts
import type { User } from "@prisma/client";
import type { CreateUserDto } from "../../dtos/user.dto";

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
