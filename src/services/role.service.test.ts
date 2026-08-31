// src/services/role.service.test.ts
import "reflect-metadata";
import { jest } from "@jest/globals";
import { beforeEach, describe, expect, it } from "@jest/globals";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";
import { PermissionActionType, PermissionAccessLevel } from "../dtos/role.dto";
import { ErrorCode } from "../errors/error.codes";
import type { IServiceContext } from "../types/service.context";
import { RoleService } from "./role.service";

jest.mock("../caches/role-permission.cache", () => ({
  invalidateRolePermissions: jest.fn(),
}));

describe("RoleService", () => {
  let mockContext: DeepMockProxy<IServiceContext>;
  let service: RoleService;

  beforeEach(() => {
    mockContext = mockDeep<IServiceContext>();
    service = new RoleService(mockContext);
  });

  describe("updateRolePermissions", () => {
    it("角色不存在時應拋出 DATA_NOT_FOUND", async () => {
      mockContext.repos.role.findById.mockResolvedValue(null);

      await expect(
        service.updateRolePermissions("role-id", {
          settings: [],
        }),
      ).rejects.toMatchObject({
        bizCode: ErrorCode.DATA_NOT_FOUND,
      });
    });

    it("NONE 不應加入任何 Permission", async () => {
      const roleId = "role-id";

      mockContext.repos.role.findById.mockResolvedValue({
        id: roleId,
        name: "Test Role",
        description: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        rolePermissions: [],
      });

      mockContext.repos.permission.findByFeatureCode.mockResolvedValue([
        {
          id: 1,
          featureCode: 1001,
          name: "取得使用者",
          apiPath: "/api/users",
          actionType: PermissionActionType.GET,
          isActive: true,
          isRequired: true,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await service.updateRolePermissions(roleId, {
        settings: [
          {
            featureCode: 1001,
            accessLevel: PermissionAccessLevel.NONE,
          },
        ],
      });

      expect(mockContext.repos.role.updatePermissions).toHaveBeenCalledWith(roleId, []);
    });

    it("VIEW 應只加入 GET Permission", async () => {
      const roleId = "role-id";

      mockContext.repos.role.findById.mockResolvedValue({
        id: roleId,
        name: "Test Role",
        description: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        rolePermissions: [],
      });

      mockContext.repos.permission.findByFeatureCode.mockResolvedValue([
        {
          id: 1,
          featureCode: 1001,
          name: "取得使用者",
          apiPath: "/api/users",
          actionType: PermissionActionType.GET,
          isActive: true,
          isRequired: true,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          featureCode: 1001,
          name: "新增使用者",
          apiPath: "/api/users",
          actionType: PermissionActionType.POST,
          isActive: true,
          isRequired: true,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await service.updateRolePermissions(roleId, {
        settings: [
          {
            featureCode: 1001,
            accessLevel: PermissionAccessLevel.VIEW,
          },
        ],
      });

      expect(mockContext.repos.role.updatePermissions).toHaveBeenCalledWith(roleId, [1]);
    });

    it("EDIT 應加入全部 Permission", async () => {
      const roleId = "role-id";

      mockContext.repos.role.findById.mockResolvedValue({
        id: roleId,
        name: "Test Role",
        description: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        rolePermissions: [],
      });

      mockContext.repos.permission.findByFeatureCode.mockResolvedValue([
        {
          id: 1,
          featureCode: 1001,
          name: "取得使用者",
          apiPath: "/api/users",
          actionType: PermissionActionType.GET,
          isActive: true,
          isRequired: true,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          featureCode: 1001,
          name: "新增使用者",
          apiPath: "/api/users",
          actionType: PermissionActionType.POST,
          isActive: true,
          isRequired: true,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await service.updateRolePermissions(roleId, {
        settings: [
          {
            featureCode: 1001,
            accessLevel: PermissionAccessLevel.EDIT,
          },
        ],
      });

      expect(mockContext.repos.role.updatePermissions).toHaveBeenCalledWith(roleId, [1, 2]);
    });
  });
});
