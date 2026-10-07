/*
  Warnings:

  - You are about to drop the column `feature_code` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the `feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_feature` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `page_group_code` to the `permission` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[role_feature] DROP CONSTRAINT [role_feature_feature_code_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[role_feature] DROP CONSTRAINT [role_feature_role_id_fkey];

-- DropIndex
DROP INDEX [permission_feature_code_idx] ON [dbo].[permission];

-- AlterTable
ALTER TABLE [dbo].[permission] DROP COLUMN [feature_code];
ALTER TABLE [dbo].[permission] ADD [page_group_code] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[feature];

-- DropTable
DROP TABLE [dbo].[role_feature];

-- CreateTable
CREATE TABLE [dbo].[page_group] (
    [page_group_code] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [route_path] NVARCHAR(1000),
    [sort_order] INT NOT NULL CONSTRAINT [page_group_sort_order_df] DEFAULT 0,
    [is_active] BIT NOT NULL CONSTRAINT [page_group_is_active_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [page_group_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [page_group_pkey] PRIMARY KEY CLUSTERED ([page_group_code])
);

-- CreateTable
CREATE TABLE [dbo].[role_page_group] (
    [role_id] UNIQUEIDENTIFIER NOT NULL,
    [page_group_code] INT NOT NULL,
    [access_level] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [role_page_group_pkey] PRIMARY KEY CLUSTERED ([role_id],[page_group_code])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [permission_page_group_code_idx] ON [dbo].[permission]([page_group_code]);

-- AddForeignKey
ALTER TABLE [dbo].[role_page_group] ADD CONSTRAINT [role_page_group_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_page_group] ADD CONSTRAINT [role_page_group_page_group_code_fkey] FOREIGN KEY ([page_group_code]) REFERENCES [dbo].[page_group]([page_group_code]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
