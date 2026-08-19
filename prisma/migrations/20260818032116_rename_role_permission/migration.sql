/*
  Warnings:

  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[role_permissions] DROP CONSTRAINT [role_permissions_permission_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[role_permissions] DROP CONSTRAINT [role_permissions_role_id_fkey];

-- DropTable
DROP TABLE [dbo].[role_permissions];

-- CreateTable
CREATE TABLE [dbo].[role_permission] (
    [role_id] UNIQUEIDENTIFIER NOT NULL,
    [permission_id] INT NOT NULL,
    CONSTRAINT [role_permission_pkey] PRIMARY KEY CLUSTERED ([role_id],[permission_id])
);

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
