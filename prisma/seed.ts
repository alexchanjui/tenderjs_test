// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const logger = {
  info: (msg: string) => console.log(`[SEED] ${msg}`),
  error: (msg: string, error?: unknown) => console.error(`[SEED] ${msg}`, error ?? ""),
};

// ==========================================
// 頁面資料
// ==========================================
const pagesData = [
  {
    pageCode: 100,
    name: "使用者管理",
    description: "管理系統使用者",
    routePath: "/users",
    isActive: true,
  },
  {
    pageCode: 200,
    name: "角色管理",
    description: "管理系統角色與角色權限",
    routePath: "/roles",
    isActive: true,
  },
  {
    pageCode: 300,
    name: "頁面管理",
    description: "管理系統頁面",
    routePath: "/pages",
    isActive: true,
  },
  {
    pageCode: 400,
    name: "招呼站管理",
    description: "管理招呼站基本資料",
    routePath: "/stops",
    isActive: true,
  },
];

// ==========================================
// 權限資料
// ==========================================
const permissionsData = [
  // 公開 API
  {
    pageCode: 0,
    name: "system:health",
    apiPath: "/api/health",
    actionType: 0, // GET
    isRequired: false,
    isActive: true,
    description: "健康檢測",
  },
  {
    pageCode: 0,
    name: "auth:login",
    apiPath: "/api/auth/login",
    actionType: 1, // POST
    isRequired: false,
    isActive: true,
    description: "使用者登入",
  },
  {
    pageCode: 0,
    name: "auth:captcha",
    apiPath: "/api/auth/captcha",
    actionType: 0, // GET
    isRequired: false,
    isActive: true,
    description: "取得登入驗證碼",
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
          description: "自動登入",
        },
      ]
    : []),

  // 100 - 使用者管理
  {
    pageCode: 100,
    name: "user:list",
    apiPath: "/api/users",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢使用者列表",
  },
  {
    pageCode: 100,
    name: "user:create",
    apiPath: "/api/users",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增使用者",
  },
  {
    pageCode: 100,
    name: "user:detail",
    apiPath: "/api/users/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢使用者詳細資訊",
  },
  {
    pageCode: 100,
    name: "user:update",
    apiPath: "/api/users/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新使用者資訊",
  },
  {
    pageCode: 100,
    name: "user:batch-delete",
    apiPath: "/api/users/batch",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除使用者",
  },

  // 200 - 角色管理
  {
    pageCode: 200,
    name: "role:list",
    apiPath: "/api/roles",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢角色列表",
  },
  {
    pageCode: 200,
    name: "role:create",
    apiPath: "/api/roles",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增角色",
  },
  {
    pageCode: 200,
    name: "role:detail",
    apiPath: "/api/roles/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢角色詳細資訊",
  },
  {
    pageCode: 200,
    name: "role:update",
    apiPath: "/api/roles/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新角色資訊",
  },
  {
    pageCode: 200,
    name: "role:delete",
    apiPath: "/api/roles/:id",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除角色",
  },
  {
    pageCode: 200,
    name: "role:update-permissions",
    apiPath: "/api/roles/:id/permissions",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新角色權限",
  },

  // 300 - 頁面管理
  {
    pageCode: 300,
    name: "page:list",
    apiPath: "/api/pages",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢頁面列表",
  },
  {
    pageCode: 300,
    name: "page:create",
    apiPath: "/api/pages",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增頁面",
  },
  {
    pageCode: 300,
    name: "page:detail",
    apiPath: "/api/pages/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢頁面詳細資訊",
  },
  {
    pageCode: 300,
    name: "page:update",
    apiPath: "/api/pages/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新頁面",
  },
  {
    pageCode: 300,
    name: "page:batch-delete",
    apiPath: "/api/pages/batch",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除頁面",
  },

  // 400 - 招呼站管理
  {
    pageCode: 400,
    name: "stop:list",
    apiPath: "/api/stops",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢招呼站列表",
  },
  {
    pageCode: 400,
    name: "stop:create",
    apiPath: "/api/stops",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增招呼站",
  },
  {
    pageCode: 400,
    name: "stop:detail",
    apiPath: "/api/stops/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢招呼站詳細資訊",
  },
  {
    pageCode: 400,
    name: "stop:update",
    apiPath: "/api/stops/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新招呼站資訊",
  },
  {
    pageCode: 400,
    name: "stop:delete",
    apiPath: "/api/stops/:id",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除招呼站",
  },
];

async function main() {
  logger.info("🌱 開始建立初始資料...");

  // ==========================================
  // Step 1: 建立 Pages
  // ==========================================
  logger.info(`📋 同步 Pages (${pagesData.length} 筆)...`);

  const pageIdByCode = new Map<number, number>();
  for (const page of pagesData) {
    const ruleName = permissionsData.find((rule) => rule.pageCode === page.pageCode)?.name;
    const rule = ruleName
      ? await prisma.permission.findUnique({ where: { name: ruleName } })
      : null;
    const existing =
      rule?.pageId != null
        ? await prisma.page.findUnique({ where: { id: rule.pageId } })
        : await prisma.page.findFirst({
            where: { OR: [{ pageCode: page.pageCode }, { routePath: page.routePath }] },
          });
    const { pageCode, ...metadata } = page;
    const saved = existing
      ? await prisma.page.update({ where: { id: existing.id }, data: metadata })
      : await prisma.page.create({ data: page });
    pageIdByCode.set(pageCode, saved.id);
  }

  logger.info("✅ Pages 建立完成");

  // ==========================================
  // Step 2: 建立 Permissions
  // ==========================================
  logger.info(`📋 同步 Permissions (${permissionsData.length} 筆)...`);

  for (const { pageCode, ...permission } of permissionsData) {
    const pageId = pageCode === 0 ? null : pageIdByCode.get(pageCode);
    if (pageId === undefined) throw new Error(`頁面代碼 ${pageCode} 不存在`);
    const data = { ...permission, pageId };
    await prisma.permission.upsert({
      where: {
        name: permission.name,
      },
      update: data,
      create: data,
    });
  }

  logger.info("✅ Permissions 建立完成");

  // ==========================================
  // Step 3: 建立 superAdmin Role
  // ==========================================
  const superAdminRole = await prisma.role.upsert({
    where: {
      name: "superAdmin",
    },
    update: {
      description: "超級管理員",
    },
    create: {
      name: "superAdmin",
      description: "超級管理員",
    },
  });

  logger.info("✅ superAdmin Role 建立完成");

  // ==========================================
  // Step 4: superAdmin 加入所有頁面權限
  // ==========================================
  const pages = await prisma.page.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  await prisma.$transaction([
    prisma.rolePage.deleteMany({
      where: {
        roleId: superAdminRole.id,
      },
    }),

    prisma.rolePage.createMany({
      data: pages.map((page) => ({
        roleId: superAdminRole.id,
        pageId: page.id,
        accessLevel: "EDIT",
      })),
    }),
  ]);

  logger.info(`✅ superAdmin 頁面權限同步完成 (${pages.length} 筆)`);

  // ==========================================
  // Step 5: 建立 admin User
  // ==========================================
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {
      roleId: superAdminRole.id,
    },
    create: {
      username: "admin",
      nickname: "Admin",
      email: "admin@example.com",
      password,
      isActive: true,
      roleId: superAdminRole.id,
    },
  });

  logger.info("✅ admin User 建立完成");

  logger.info("🎉 Seed 完成");
}

main()
  .catch((error) => {
    logger.error("❌ Seed 執行失敗", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
