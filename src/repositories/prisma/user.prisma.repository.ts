import type { User } from "@prisma/client";
import type { CreateUserDto, UpdateUserRequestDto } from "../../dtos/user.dto";
import type { IDbContext } from "../../types/db.context";
import type { IUserRepository, UserWithRole } from "../interface/user.repository.interface";

const roleInclude = {
  include: {
    rolePages: true,
    rolePermissions: true,
  },
} as const;

export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly ctx: IDbContext) {}

  public async create(data: CreateUserDto & { password: string }): Promise<User> {
    return this.ctx.prisma.user.create({
      data: {
        username: data.username,
        nickname: data.nickname,
        email: data.email,
        password: data.password,
        userType: data.userType,
        vendorId: data.userType === "VENDOR" ? data.vendorId : null,
        roleId: data.roleId,
      },
    });
  }

  public async findById(id: string): Promise<UserWithRole | null> {
    return this.ctx.prisma.user.findUnique({
      where: { id },
      include: { role: roleInclude },
    });
  }

  public async findByEmail(email: string): Promise<UserWithRole | null> {
    return this.ctx.prisma.user.findUnique({
      where: { email },
      include: { role: roleInclude },
    });
  }

  public async findByUsername(username: string): Promise<UserWithRole | null> {
    return this.ctx.prisma.user.findUnique({
      where: { username },
      include: { role: roleInclude },
    });
  }

  public async findAndCount(params: {
    skip?: number;
    take?: number;
    vendorId?: string | null;
    userType?: string;
  }): Promise<[UserWithRole[], number]> {
    const where = {
      ...(params.vendorId !== undefined ? { vendorId: params.vendorId } : {}),
      ...(params.userType ? { userType: params.userType } : {}),
    };

    return this.ctx.prisma.$transaction([
      this.ctx.prisma.user.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: { role: roleInclude },
      }),
      this.ctx.prisma.user.count({ where }),
    ]);
  }

  public async update(id: string, data: UpdateUserRequestDto): Promise<void> {
    await this.ctx.prisma.user.update({ where: { id }, data });
  }

  public async batchDelete(ids: string[]): Promise<number> {
    const result = await this.ctx.prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    return result.count;
  }
}
