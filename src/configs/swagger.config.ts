// src/configs/swagger.config.ts
import swaggerJsdoc from "swagger-jsdoc";

const appVersion = process.env.APP_VERSION ?? "1.0.0";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "vueAdmin API",
      version: appVersion,
      description: "vueAdmin Backend API 文件",
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      parameters: {
        NodeIdHeader: {
          in: "header",
          name: "X-Node-Id",
          required: false,
          description: "目前操作的組織節點 ID；未提供時使用登入者所屬節點",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      },
    },
    tags: [
      {
        name: "共用｜Auth",
        description: "營運端與業者端皆可使用的登入驗證 API",
      },
      {
        name: "共用｜Users",
        description: "營運端與業者端皆可使用的使用者管理 API",
      },
      {
        name: "共用｜Roles",
        description: "營運端與業者端皆可使用的角色管理 API",
      },
      {
        name: "共用｜FAQ",
        description: "營運端與業者端皆可使用的常見問題管理 API",
      },
      {
        name: "共用｜Options",
        description: "營運端與業者端皆可使用的下拉選項 API",
      },
      {
        name: "共用｜Vendor Profile",
        description: "營運端與業者端皆可使用的業者品牌資料 API",
      },
      {
        name: "營運端｜Pages",
        description: "僅供營運端使用的頁面管理 API",
      },
      {
        name: "營運端｜Permissions",
        description: "僅供營運端使用的權限管理 API",
      },
      {
        name: "營運端｜Vendors",
        description: "僅供營運端使用的業者管理 API",
      },
    ],
  },

  apis: ["./src/docs/*.swagger.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
