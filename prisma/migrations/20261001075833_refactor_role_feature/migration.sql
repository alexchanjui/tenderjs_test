/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the `role_permission` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[role_permission] DROP CONSTRAINT [role_permission_permission_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[role_permission] DROP CONSTRAINT [role_permission_role_id_fkey];

-- DropDefaultConstraint
ALTER TABLE [dbo].[permission] DROP CONSTRAINT [permission_sortOrder_df];

-- AlterTable
ALTER TABLE [dbo].[permission] DROP COLUMN [sortOrder];

-- DropTable
DROP TABLE [dbo].[role_permission];

-- CreateTable
CREATE TABLE [dbo].[feature] (
    [feature_code] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [route_path] NVARCHAR(1000),
    [sort_order] INT NOT NULL CONSTRAINT [feature_sort_order_df] DEFAULT 0,
    [is_active] BIT NOT NULL CONSTRAINT [feature_is_active_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [feature_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [feature_pkey] PRIMARY KEY CLUSTERED ([feature_code])
);

-- CreateTable
CREATE TABLE [dbo].[role_feature] (
    [role_id] UNIQUEIDENTIFIER NOT NULL,
    [feature_code] INT NOT NULL,
    [access_level] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [role_feature_pkey] PRIMARY KEY CLUSTERED ([role_id],[feature_code])
);

-- AddForeignKey
ALTER TABLE [dbo].[role_feature] ADD CONSTRAINT [role_feature_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_feature] ADD CONSTRAINT [role_feature_feature_code_fkey] FOREIGN KEY ([feature_code]) REFERENCES [dbo].[feature]([feature_code]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
