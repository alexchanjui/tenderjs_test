// src/utils/prisma.ts
import { PrismaClient } from "@prisma/client";

export class PrismaService {
  public readonly client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  /**
   * 建立資料庫連線
   */
  public async connect(): Promise<void> {
    await this.client.$connect();
  }
}

const prismaInstance = new PrismaService();
export default prismaInstance;
