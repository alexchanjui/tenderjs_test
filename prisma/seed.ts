// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const logger = {
  info: (msg: string) => console.log(`[SEED] ${msg}`),
  error: (msg: string, error?: unknown) => console.error(`[SEED] ${msg}`, error ?? ""),
};

// ==========================================
// 權限資料
// ==========================================
const permissionsData = [
  // 公開 API
  {
    sortOrder: 1,
    featureCode: 0,
    name: "system:health",
    apiPath: "/api/health",
    actionType: 0, // GET
    isRequired: false,
    isActive: true,
    description: "健康檢測",
  },
  {
    sortOrder: 2,
    featureCode: 0,
    name: "auth:login",
    apiPath: "/api/auth/login",
    actionType: 1, // POST
    isRequired: false,
    isActive: true,
    description: "使用者登入",
  },
  {
    sortOrder: 3,
    featureCode: 0,
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
          sortOrder: 4,
          featureCode: 0,
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
    sortOrder: 5,
    featureCode: 100,
    name: "user:list",
    apiPath: "/api/users",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢使用者列表",
  },
  {
    sortOrder: 6,
    featureCode: 100,
    name: "user:create",
    apiPath: "/api/users",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增使用者",
  },
  {
    sortOrder: 7,
    featureCode: 100,
    name: "user:detail",
    apiPath: "/api/users/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢使用者詳細資訊",
  },
  {
    sortOrder: 8,
    featureCode: 100,
    name: "user:update",
    apiPath: "/api/users/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新使用者資訊",
  },
  {
    sortOrder: 9,
    featureCode: 100,
    name: "user:batch-delete",
    apiPath: "/api/users/batch",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除使用者",
  },
  {
    sortOrder: 10,
    featureCode: 100,
    name: "user:me",
    apiPath: "/api/users/me",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "取得當前使用者詳細資訊",
  },

  // 200 - 角色管理
  {
    sortOrder: 11,
    featureCode: 200,
    name: "role:list",
    apiPath: "/api/roles",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢角色列表",
  },
  {
    sortOrder: 12,
    featureCode: 200,
    name: "role:create",
    apiPath: "/api/roles",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增角色",
  },
  {
    sortOrder: 13,
    featureCode: 200,
    name: "role:detail",
    apiPath: "/api/roles/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢角色詳細資訊",
  },
  {
    sortOrder: 14,
    featureCode: 200,
    name: "role:update",
    apiPath: "/api/roles/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新角色資訊",
  },
  {
    sortOrder: 15,
    featureCode: 200,
    name: "role:delete",
    apiPath: "/api/roles/:id",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除角色",
  },
  {
    sortOrder: 16,
    featureCode: 200,
    name: "role/:id/permissions",
    apiPath: "/api/roles/:id/permissions",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新角色的權限",
  },

  // 300 - 權限管理
  {
    sortOrder: 17,
    featureCode: 300,
    name: "permission:list",
    apiPath: "/api/permissions",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢權限列表",
  },
  {
    sortOrder: 18,
    featureCode: 300,
    name: "permission:create",
    apiPath: "/api/permissions",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增權限",
  },
  {
    sortOrder: 19,
    featureCode: 300,
    name: "permission:detail",
    apiPath: "/api/permissions/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢權限詳細資訊",
  },
  {
    sortOrder: 20,
    featureCode: 300,
    name: "permission:update",
    apiPath: "/api/permissions/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新權限資訊",
  },
  {
    sortOrder: 21,
    featureCode: 300,
    name: "permission:batch-delete",
    apiPath: "/api/permissions/batch",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除權限",
  },

  // 400 - 招呼站管理
  {
    sortOrder: 22,
    featureCode: 400,
    name: "stop:list",
    apiPath: "/api/stops",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢招呼站列表",
  },
  {
    sortOrder: 23,
    featureCode: 400,
    name: "stop:create",
    apiPath: "/api/stops",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增招呼站",
  },
  {
    sortOrder: 24,
    featureCode: 400,
    name: "stop:detail",
    apiPath: "/api/stops/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢招呼站詳細資訊",
  },
  {
    sortOrder: 25,
    featureCode: 400,
    name: "stop:update",
    apiPath: "/api/stops/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新招呼站資訊",
  },
  {
    sortOrder: 26,
    featureCode: 400,
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
  // Step 1: 建立 Permissions
  // ==========================================
  logger.info(`📋 同步 Permissions (${permissionsData.length} 筆)...`);

  for (const permission of permissionsData) {
    await prisma.permission.upsert({
      where: {
        name: permission.name,
      },
      update: permission,
      create: permission,
    });
  }

  logger.info("✅ Permissions 建立完成");

  // ==========================================
  // Step 2: 建立 superAdmin Role
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
  // Step 3: superAdmin 加入所有權限
  // ==========================================
  const permissions = await prisma.permission.findMany({
    where: {
      isActive: true,
      isRequired: true,
    },
    select: {
      id: true,
    },
  });

  await prisma.$transaction([
    prisma.rolePermission.deleteMany({
      where: {
        roleId: superAdminRole.id,
      },
    }),

    prisma.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId: superAdminRole.id,
        permissionId: permission.id,
      })),
    }),
  ]);

  logger.info(`✅ superAdmin 權限同步完成 (${permissions.length} 筆)`);

  // ==========================================
  // Step 4: 建立 admin User
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
