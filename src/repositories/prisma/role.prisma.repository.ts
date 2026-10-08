import type { Role } from "@prisma/client";
import type { CreateRoleRequestDto, UpdateRoleRequestDto } from "../../dtos/role.dto";
import type { IDbContext } from "../../types/db.context";
import type { IRoleRepository, RoleWithPermissions } from "../interface/role.repository.interface";

export class RolePrismaRepository implements IRoleRepository {
  constructor(private readonly ctx: IDbContext) {}

  public async create(data: CreateRoleRequestDto): Promise<Role> {
    return this.ctx.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        scope: data.scope,
        vendorId: data.scope === "VENDOR" ? data.vendorId : null,
      },
    });
  }

  public async findAll(): Promise<Role[]> {
    return this.ctx.prisma.role.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
  }

  public async findById(id: string): Promise<RoleWithPermissions | null> {
    return this.ctx.prisma.role.findUnique({
      where: { id },
      include: {
        rolePages: true,
        rolePermissions: true,
        _count: { select: { users: true } },
      },
    });
  }

  public async findByName(
    name: string,
    scope: string,
    vendorId: string | null,
  ): Promise<Role | null> {
    return this.ctx.prisma.role.findFirst({
      where: { name, scope, vendorId },
    });
  }

  public async findAndCount(params: {
    skip?: number;
    take?: number;
    scope?: string;
    vendorId?: string | null;
  }): Promise<[RoleWithPermissions[], number]> {
    const where = {
      ...(params.scope ? { scope: params.scope } : {}),
      ...(params.vendorId !== undefined ? { vendorId: params.vendorId } : {}),
    };

    return this.ctx.prisma.$transaction([
      this.ctx.prisma.role.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: {
          rolePages: true,
          rolePermissions: true,
          _count: { select: { users: true } },
        },
      }),
      this.ctx.prisma.role.count({ where }),
    ]);
  }

  public async update(id: string, data: UpdateRoleRequestDto): Promise<void> {
    await this.ctx.prisma.role.update({ where: { id }, data });
  }

  public async countUsersByRoleIds(ids: string[]): Promise<number> {
    return this.ctx.prisma.user.count({ where: { roleId: { in: ids } } });
  }

  public async batchDelete(ids: string[]): Promise<void> {
    await this.ctx.prisma.role.deleteMany({
      where: { id: { in: ids }, isSystem: false },
    });
  }

  public async updatePages(roleId: string, pageIds: number[]): Promise<void> {
    await this.ctx.prisma.$transaction(async (tx) => {
      await tx.rolePage.deleteMany({ where: { roleId } });

      if (pageIds.length > 0) {
        await tx.rolePage.createMany({
          data: pageIds.map((pageId) => ({ roleId, pageId })),
        });
      }
    });
  }

  public async updatePermissions(roleId: string, permissionIds: number[]): Promise<void> {
    await this.ctx.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });

      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
        });
      }
    });
  }
}
