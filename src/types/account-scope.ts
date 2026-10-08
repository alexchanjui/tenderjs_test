// src/types/account-scope.ts
export const UserType = {
  PLATFORM: "PLATFORM",
  VENDOR: "VENDOR",
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

export const RoleScope = {
  PLATFORM: "PLATFORM",
  VENDOR: "VENDOR",
} as const;

export type RoleScope = (typeof RoleScope)[keyof typeof RoleScope];
