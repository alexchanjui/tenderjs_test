import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const pagesData = [
  {
    pageCode: 100,
    name: "使用者管理",
    description: "管理使用者",
    routePath: "/users",
    isActive: true,
  },
  { pageCode: 200, name: "角色管理", description: "管理角色", routePath: "/roles", isActive: true },
  { pageCode: 300, name: "頁面管理", description: "管理頁面", routePath: "/pages", isActive: true },
  {
    pageCode: 400,
    name: "業者管理",
    description: "管理業者與業者權限",
    routePath: "/vendors",
    isActive: true,
  },
];

const permissionsData = [
  {
    pageCode: 0,
    name: "system:health",
    apiPath: "/api/health",
    actionType: 0,
    isRequired: false,
    isActive: true,
    description: "健康檢測",
  },
  {
    pageCode: 0,
    name: "auth:login",
    apiPath: "/api/auth/login",
    actionType: 1,
    isRequired: false,
    isActive: true,
    description: "使用者登入",
  },
  {
    pageCode: 0,
    name: "auth:auto-login",
    apiPath: "/api/auth/auto-login",
    actionType: 1,
    isRequired: false,
    isActive: true,
    description: "開發環境自動登入",
  },
  {
    pageCode: 0,
    name: "auth:captcha",
    apiPath: "/api/auth/captcha",
    actionType: 0,
    isRequired: false,
    isActive: true,
    description: "取得登入驗證碼",
  },
  {
    pageCode: 0,
    name: "user:me",
    apiPath: "/api/users/me",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "取得當前登入使用者資訊",
  },
  ...(process.env.NODE_ENV === "development"
    ? [
        {
          pageCode: 0,
          name: "auth:auto-login",
          apiPath: "/api/auth/auto-login",
          actionType: 1,
          isRequired: false,
          isActive: true,
          description: "開發環境自動登入",
        },
      ]
    : []),
  {
    pageCode: 100,
    name: "user:list",
    apiPath: "/api/users",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢使用者列表",
  },
  {
    pageCode: 100,
    name: "user:create",
    apiPath: "/api/users",
    actionType: 1,
    isRequired: true,
    isActive: true,
    description: "新增使用者",
  },
  {
    pageCode: 100,
    name: "user:detail",
    apiPath: "/api/users/:id",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢使用者詳細資訊",
  },
  {
    pageCode: 100,
    name: "user:update",
    apiPath: "/api/users/:id",
    actionType: 2,
    isRequired: true,
    isActive: true,
    description: "更新使用者資訊",
  },
  {
    pageCode: 100,
    name: "user:batch-delete",
    apiPath: "/api/users/batch",
    actionType: 3,
    isRequired: true,
    isActive: true,
    description: "刪除使用者",
  },

  {
    pageCode: 200,
    name: "role:list",
    apiPath: "/api/roles",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢角色列表",
  },
  {
    pageCode: 200,
    name: "role:create",
    apiPath: "/api/roles",
    actionType: 1,
    isRequired: true,
    isActive: true,
    description: "新增角色",
  },
  {
    pageCode: 200,
    name: "role:detail",
    apiPath: "/api/roles/:id",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢角色詳細資訊",
  },
  {
    pageCode: 200,
    name: "role:update",
    apiPath: "/api/roles/:id",
    actionType: 2,
    isRequired: true,
    isActive: true,
    description: "更新角色資訊",
  },
  {
    pageCode: 200,
    name: "role:batch-delete",
    apiPath: "/api/roles/batch",
    actionType: 3,
    isRequired: true,
    isActive: true,
    description: "刪除角色",
  },
  {
    pageCode: 200,
    name: "role:update-pages",
    apiPath: "/api/roles/:id/pages",
    actionType: 2,
    isRequired: true,
    isActive: true,
    description: "更新角色頁面",
  },
  {
    pageCode: 200,
    name: "role:update-permissions",
    apiPath: "/api/roles/:id/permissions",
    actionType: 2,
    isRequired: true,
    isActive: true,
    description: "更新角色 API 權限",
  },

  {
    pageCode: 300,
    name: "page:list",
    apiPath: "/api/pages",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢頁面列表",
  },
  {
    pageCode: 300,
    name: "page:create",
    apiPath: "/api/pages",
    actionType: 1,
    isRequired: true,
    isActive: true,
    description: "新增頁面",
  },
  {
    pageCode: 300,
    name: "page:detail",
    apiPath: "/api/pages/:id",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢頁面詳細資訊",
  },
  {
    pageCode: 300,
    name: "page:update",
    apiPath: "/api/pages/:id",
    actionType: 2,
    isRequired: true,
    isActive: true,
    description: "更新頁面",
  },
  {
    pageCode: 300,
    name: "page:batch-delete",
    apiPath: "/api/pages/batch",
    actionType: 3,
    isRequired: true,
    isActive: true,
    description: "刪除頁面",
  },

  {
    pageCode: 400,
    name: "vendor:list",
    apiPath: "/api/vendors",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢業者列表",
  },
  {
    pageCode: 400,
    name: "vendor:create",
    apiPath: "/api/vendors",
    actionType: 1,
    isRequired: true,
    isActive: true,
    description: "新增業者",
  },
  {
    pageCode: 400,
    name: "vendor:detail",
    apiPath: "/api/vendors/:id",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢業者詳細資訊",
  },
  {
    pageCode: 400,
    name: "vendor:update",
    apiPath: "/api/vendors/:id",
    actionType: 2,
    isRequired: true,
    isActive: true,
    description: "更新業者",
  },
  {
    pageCode: 400,
    name: "vendor:batch-delete",
    apiPath: "/api/vendors/batch",
    actionType: 3,
    isRequired: true,
    isActive: true,
    description: "刪除業者",
  },
  {
    pageCode: 400,
    name: "vendor:permission-list",
    apiPath: "/api/vendors/:id/permissions",
    actionType: 0,
    isRequired: true,
    isActive: true,
    description: "查詢業者可用 API 權限",
  },
  {
    pageCode: 400,
    name: "vendor:update-permissions",
    apiPath: "/api/vendors/:id/permissions",
    actionType: 2,
    isRequired: true,
    isActive: true,
    description: "更新業者可用 API 權限",
  },
];

async function main() {
  const pageIdByCode = new Map<number, number>();

  for (const page of pagesData) {
    const saved = await prisma.page.upsert({
      where: { pageCode: page.pageCode },
      update: page,
      create: page,
    });
    pageIdByCode.set(page.pageCode, saved.id);
  }

  for (const { pageCode, ...permission } of permissionsData) {
    const pageId = pageCode === 0 ? null : pageIdByCode.get(pageCode)!;
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { ...permission, pageId },
      create: { ...permission, pageId },
    });
  }

  const superAdminRole =
    (await prisma.role.findFirst({
      where: { name: "superAdmin", scope: "PLATFORM", vendorId: null },
    })) ??
    (await prisma.role.create({
      data: {
        name: "superAdmin",
        description: "超級管理員",
        scope: "PLATFORM",
        vendorId: null,
        isSystem: true,
      },
    }));

  const pages = await prisma.page.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  const permissions = await prisma.permission.findMany({
    where: { isActive: true, isRequired: true },
    select: { id: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.rolePage.deleteMany({ where: { roleId: superAdminRole.id } });
    await tx.rolePermission.deleteMany({ where: { roleId: superAdminRole.id } });

    await tx.rolePage.createMany({
      data: pages.map((page) => ({
        roleId: superAdminRole.id,
        pageId: page.id,
      })),
    });

    await tx.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId: superAdminRole.id,
        permissionId: permission.id,
      })),
    });
  });

  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      roleId: superAdminRole.id,
      userType: "PLATFORM",
      vendorId: null,
    },
    create: {
      username: "admin",
      nickname: "Admin",
      email: "admin@example.com",
      password,
      userType: "PLATFORM",
      vendorId: null,
      isActive: true,
      roleId: superAdminRole.id,
    },
  });

  console.log("✅ Seed 完成");
}

main()
  .catch((error) => {
    console.error("❌ Seed 執行失敗", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
