// src/services/user.service.test.ts
import { beforeEach, describe, expect, it } from "@jest/globals";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";
import { UserService } from "./user.service";

describe("UserService", () => {
  let mockContext: DeepMockProxy<IServiceContext>;
  let service: UserService;

  beforeEach(() => {
    mockContext = mockDeep<IServiceContext>();
    service = new UserService(mockContext);
  });

  describe("getUserById", () => {
    it("找不到使用者時應拋出 ACCOUNT_NOT_EXIST", async () => {
      mockContext.repos.user.findById.mockResolvedValue(null);

      await expect(service.getUserById("test-user-id")).rejects.toMatchObject({
        bizCode: ErrorCode.ACCOUNT_NOT_EXIST,
      });
    });

    it("找到使用者時應回傳使用者資料", async () => {
      const mockUser = {
        id: "test-user-id",
        username: "test",
        email: "test@example.com",
        password: "hashed-password",
        isActive: true,
        roleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockContext.repos.user.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById("test-user-id");

      expect(result.id).toBe(mockUser.id);
    });
  });

  describe("deleteUser", () => {
    it("沒有登入資訊時應拋出 UNAUTH", async () => {
      mockContext.currentUser = undefined;

      await expect(service.deleteUser("test-user-id")).rejects.toMatchObject({
        bizCode: ErrorCode.UNAUTH,
      });
    });

    it("刪除自己時應拋出 REQUEST_DATA", async () => {
      mockContext.currentUser = { id: "test-user-id", roleId: null };

      await expect(service.deleteUser("test-user-id")).rejects.toMatchObject({
        bizCode: ErrorCode.REQUEST_DATA,
      });
    });

    it("找不到使用者時應拋出 ACCOUNT_NOT_EXIST", async () => {
      mockContext.currentUser = {
        id: "current-user-id",
        roleId: null,
      };
      mockContext.repos.user.findById.mockResolvedValue(null);

      await expect(service.deleteUser("target-user-id")).rejects.toMatchObject({
        bizCode: ErrorCode.ACCOUNT_NOT_EXIST,
      });
    });
  });
});
