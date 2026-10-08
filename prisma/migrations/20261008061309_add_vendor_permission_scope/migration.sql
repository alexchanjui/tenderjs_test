/*
  Warnings:

  - You are about to drop the column `access_level` on the `role_page` table. All the data in the column will be lost.
  - You are about to drop the `sys_stop` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scope` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `user` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[user] DROP CONSTRAINT [user_role_id_fkey];

-- DropIndex
ALTER TABLE [dbo].[role] DROP CONSTRAINT [role_name_key];

-- AlterTable
ALTER TABLE [dbo].[role] ADD [is_system] BIT NOT NULL CONSTRAINT [role_is_system_df] DEFAULT 0,
[scope] NVARCHAR(1000) NOT NULL,
[vendor_id] UNIQUEIDENTIFIER;

-- AlterTable
ALTER TABLE [dbo].[role_page] DROP COLUMN [access_level];

-- AlterTable
ALTER TABLE [dbo].[user] ADD [user_type] NVARCHAR(1000) NOT NULL,
[vendor_id] UNIQUEIDENTIFIER;

-- DropTable
DROP TABLE [dbo].[sys_stop];

-- CreateTable
CREATE TABLE [dbo].[vendor] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [vendor_id_df] DEFAULT newid(),
    [name] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [vendor_is_active_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [vendor_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [vendor_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [vendor_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[vendor_permission] (
    [vendor_id] UNIQUEIDENTIFIER NOT NULL,
    [permission_id] INT NOT NULL,
    CONSTRAINT [vendor_permission_pkey] PRIMARY KEY CLUSTERED ([vendor_id],[permission_id])
);

-- CreateTable
CREATE TABLE [dbo].[role_permission] (
    [role_id] UNIQUEIDENTIFIER NOT NULL,
    [permission_id] INT NOT NULL,
    CONSTRAINT [role_permission_pkey] PRIMARY KEY CLUSTERED ([role_id],[permission_id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [vendor_permission_permission_id_idx] ON [dbo].[vendor_permission]([permission_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [role_permission_permission_id_idx] ON [dbo].[role_permission]([permission_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [role_vendor_id_name_idx] ON [dbo].[role]([vendor_id], [name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [role_scope_idx] ON [dbo].[role]([scope]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [user_vendor_id_idx] ON [dbo].[user]([vendor_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [user_role_id_idx] ON [dbo].[user]([role_id]);

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_vendor_id_fkey] FOREIGN KEY ([vendor_id]) REFERENCES [dbo].[vendor]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[role] ADD CONSTRAINT [role_vendor_id_fkey] FOREIGN KEY ([vendor_id]) REFERENCES [dbo].[vendor]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vendor_permission] ADD CONSTRAINT [vendor_permission_vendor_id_fkey] FOREIGN KEY ([vendor_id]) REFERENCES [dbo].[vendor]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[vendor_permission] ADD CONSTRAINT [vendor_permission_permission_id_fkey] FOREIGN KEY ([permission_id]) REFERENCES [dbo].[permission]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_permission_id_fkey] FOREIGN KEY ([permission_id]) REFERENCES [dbo].[permission]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
