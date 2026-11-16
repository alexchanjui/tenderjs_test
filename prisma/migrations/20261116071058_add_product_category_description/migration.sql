/*
  Warnings:

  - You are about to alter the column `name` on the `product_category` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(100)` to `NVarChar(20)`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[product_category] DROP CONSTRAINT [product_category_name_key];

-- AlterTable
ALTER TABLE [dbo].[product_category] ALTER COLUMN [name] NVARCHAR(20) NOT NULL;
ALTER TABLE [dbo].[product_category] ADD [description] NVARCHAR(250);

-- CreateIndex
ALTER TABLE [dbo].[product_category] ADD CONSTRAINT [product_category_name_key] UNIQUE NONCLUSTERED ([name]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
