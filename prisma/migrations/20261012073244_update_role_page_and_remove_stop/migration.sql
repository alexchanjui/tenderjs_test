/*
  Warnings:

  - You are about to drop the column `access_level` on the `role_page` table. All the data in the column will be lost.
  - You are about to drop the `sys_stop` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[role_page] DROP COLUMN [access_level];

-- DropTable
DROP TABLE [dbo].[sys_stop];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
