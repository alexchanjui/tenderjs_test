// src/configs/swagger.config.ts
import swaggerJsdoc from "swagger-jsdoc";

const appVersion = process.env.APP_VERSION ?? "1.0.0";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "TenderJS API",
      version: appVersion,
      description: "TenderJS Backend API 文件",
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
    },
  },

  apis: ["./src/docs/*.swagger.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
