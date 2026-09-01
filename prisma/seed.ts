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
    id: 1,
    featureCode: 0,
    name: "system:health",
    apiPath: "/api/v1/health",
    actionType: 0, // GET
    isRequired: false,
    isActive: true,
    description: "健康檢測",
  },
  {
    id: 2,
    featureCode: 0,
    name: "auth:login",
    apiPath: "/api/v1/auth/login",
    actionType: 1, // POST
    isRequired: false,
    isActive: true,
    description: "使用者登入",
  },

  // 100 - 使用者管理
  {
    id: 101,
    featureCode: 100,
    name: "user:list",
    apiPath: "/api/v1/users",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢使用者列表",
  },
  {
    id: 102,
    featureCode: 100,
    name: "user:create",
    apiPath: "/api/v1/users",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增使用者",
  },
  {
    id: 103,
    featureCode: 100,
    name: "user:detail",
    apiPath: "/api/v1/users/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢使用者詳細資訊",
  },
  {
    id: 104,
    featureCode: 100,
    name: "user:update",
    apiPath: "/api/v1/users/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新使用者資訊",
  },
  {
    id: 105,
    featureCode: 100,
    name: "user:delete",
    apiPath: "/api/v1/users/:id",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除使用者",
  },
  {
    id: 106,
    featureCode: 100,
    name: "user:me",
    apiPath: "/api/v1/users/me",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "取得當前使用者詳細資料",
  },

  // 200 - 角色管理
  {
    id: 201,
    featureCode: 200,
    name: "role:list",
    apiPath: "/api/v1/roles",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢角色列表",
  },
  {
    id: 202,
    featureCode: 200,
    name: "role:create",
    apiPath: "/api/v1/roles",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增角色",
  },
  {
    id: 203,
    featureCode: 200,
    name: "role:detail",
    apiPath: "/api/v1/roles/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢角色詳細資訊",
  },
  {
    id: 204,
    featureCode: 200,
    name: "role:update",
    apiPath: "/api/v1/roles/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新角色資訊",
  },
  {
    id: 205,
    featureCode: 200,
    name: "role:delete",
    apiPath: "/api/v1/roles/:id",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除角色",
  },
  {
    id: 206,
    featureCode: 200,
    name: "role/:id/permissions",
    apiPath: "/api/v1/roles/:id/permissions",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新角色的權限",
  },

  // 300 - 權限管理
  {
    id: 301,
    featureCode: 300,
    name: "permission:list",
    apiPath: "/api/v1/permissions",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢權限列表",
  },
  {
    id: 302,
    featureCode: 300,
    name: "permission:create",
    apiPath: "/api/v1/permissions",
    actionType: 1, // POST
    isRequired: true,
    isActive: true,
    description: "新增權限",
  },
  {
    id: 303,
    featureCode: 300,
    name: "permission:detail",
    apiPath: "/api/v1/permissions/:id",
    actionType: 0, // GET
    isRequired: true,
    isActive: true,
    description: "查詢權限詳細資訊",
  },
  {
    id: 304,
    featureCode: 300,
    name: "permission:update",
    apiPath: "/api/v1/permissions/:id",
    actionType: 2, // PUT
    isRequired: true,
    isActive: true,
    description: "更新權限資訊",
  },
  {
    id: 305,
    featureCode: 300,
    name: "permission:delete",
    apiPath: "/api/v1/permissions/:id",
    actionType: 3, // DELETE
    isRequired: true,
    isActive: true,
    description: "刪除權限",
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
        id: permission.id,
      },
      update: permission,
      create: permission,
    });
  }

  logger.info("✅ Permissions 建立完成");

  // ==========================================
  // Step 2: 建立 Admin Role
  // ==========================================
  const adminRole = await prisma.role.upsert({
    where: {
      name: "Admin",
    },
    update: {},
    create: {
      name: "Admin",
      description: "系統管理員",
    },
  });

  logger.info("✅ Admin Role 建立完成");

  // ==========================================
  // Step 3: 建立 Admin User
  // ==========================================
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password,
      isActive: true,
      roleId: adminRole.id,
    },
  });

  logger.info("✅ Admin User 建立完成");

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
