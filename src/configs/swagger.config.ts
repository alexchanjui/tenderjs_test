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
  },

  apis: ["./src/docs/*.swagger.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
