/*
  Warnings:

  - You are about to drop the column `vendor_id` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `vendor_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `vendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor_page` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `node_id` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `node_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[role] DROP CONSTRAINT [role_vendor_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[user] DROP CONSTRAINT [user_vendor_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[vendor_page] DROP CONSTRAINT [vendor_page_page_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[vendor_page] DROP CONSTRAINT [vendor_page_vendor_id_fkey];

-- DropIndex
DROP INDEX [role_vendor_id_idx] ON [dbo].[role];

-- DropIndex
DROP INDEX [user_vendor_id_idx] ON [dbo].[user];

-- AlterTable
ALTER TABLE [dbo].[role] DROP COLUMN [vendor_id];
ALTER TABLE [dbo].[role] ADD [node_id] UNIQUEIDENTIFIER NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[user] DROP COLUMN [vendor_id];
ALTER TABLE [dbo].[user] ADD [node_id] UNIQUEIDENTIFIER NOT NULL;

-- DropTable
DROP TABLE [dbo].[vendor];

-- DropTable
DROP TABLE [dbo].[vendor_page];

-- CreateTable
CREATE TABLE [dbo].[node] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [node_id_df] DEFAULT newid(),
    [code] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [is_active] BIT NOT NULL CONSTRAINT [node_is_active_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [node_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [node_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [node_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[node_page] (
    [node_id] UNIQUEIDENTIFIER NOT NULL,
    [page_id] INT NOT NULL,
    CONSTRAINT [node_page_pkey] PRIMARY KEY CLUSTERED ([node_id],[page_id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [node_type_idx] ON [dbo].[node]([type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [role_node_id_idx] ON [dbo].[role]([node_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [user_node_id_idx] ON [dbo].[user]([node_id]);

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_node_id_fkey] FOREIGN KEY ([node_id]) REFERENCES [dbo].[node]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[role] ADD CONSTRAINT [role_node_id_fkey] FOREIGN KEY ([node_id]) REFERENCES [dbo].[node]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[node_page] ADD CONSTRAINT [node_page_node_id_fkey] FOREIGN KEY ([node_id]) REFERENCES [dbo].[node]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[node_page] ADD CONSTRAINT [node_page_page_id_fkey] FOREIGN KEY ([page_id]) REFERENCES [dbo].[page]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
