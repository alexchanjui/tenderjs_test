/*
  Warnings:

  - The primary key for the `faq` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `category_id` on the `faq` table. The data in that column will be cast from `Uuid` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - You are about to alter the column `id` on the `faq` table. The data in that column will be cast from `Uuid` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - The primary key for the `faq_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `faq_category` table. The data in that column will be cast from `Uuid` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - The primary key for the `operating_term` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `operating_term` table. The data in that column will be cast from `Uuid` to `Int`. This cast may fail. Please make sure the data in the column can be cast.
  - The primary key for the `vendor_banner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `vendor_banner` table. The data in that column will be cast from `Uuid` to `Int`. This cast may fail. Please make sure the data in the column can be cast.

*/
BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
DROP INDEX [faq_category_id_idx] ON [dbo].[faq];
DECLARE @SQL_FAQ NVARCHAR(MAX) = N''
SELECT @SQL_FAQ += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'faq'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL_FAQ
;
CREATE TABLE [dbo].[_prisma_new_faq] (
    [id] INT NOT NULL IDENTITY(1,1),
    [category_id] INT NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [sort_order] INT NOT NULL CONSTRAINT [faq_sort_order_df] DEFAULT 1,
    [is_active] BIT NOT NULL CONSTRAINT [faq_is_active_df] DEFAULT 1,
    CONSTRAINT [faq_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_faq] ON;
IF EXISTS(SELECT * FROM [dbo].[faq])
    EXEC('INSERT INTO [dbo].[_prisma_new_faq] ([category_id],[content],[id],[is_active],[sort_order],[title]) SELECT [category_id],[content],[id],[is_active],[sort_order],[title] FROM [dbo].[faq] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_faq] OFF;
DROP TABLE [dbo].[faq];
EXEC SP_RENAME N'dbo._prisma_new_faq', N'faq';
CREATE NONCLUSTERED INDEX [faq_category_id_idx] ON [dbo].[faq]([category_id]);
DROP INDEX [faq_category_vendor_profile_id_idx] ON [dbo].[faq_category];
DECLARE @SQL_FAQ_CATEGORY NVARCHAR(MAX) = N''
SELECT @SQL_FAQ_CATEGORY += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'faq_category'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL_FAQ_CATEGORY
;
CREATE TABLE [dbo].[_prisma_new_faq_category] (
    [id] INT NOT NULL IDENTITY(1,1),
    [vendor_profile_id] UNIQUEIDENTIFIER NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [sort_order] INT NOT NULL CONSTRAINT [faq_category_sort_order_df] DEFAULT 1,
    [is_active] BIT NOT NULL CONSTRAINT [faq_category_is_active_df] DEFAULT 1,
    CONSTRAINT [faq_category_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_faq_category] ON;
IF EXISTS(SELECT * FROM [dbo].[faq_category])
    EXEC('INSERT INTO [dbo].[_prisma_new_faq_category] ([id],[is_active],[sort_order],[title],[vendor_profile_id]) SELECT [id],[is_active],[sort_order],[title],[vendor_profile_id] FROM [dbo].[faq_category] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_faq_category] OFF;
DROP TABLE [dbo].[faq_category];
EXEC SP_RENAME N'dbo._prisma_new_faq_category', N'faq_category';
CREATE NONCLUSTERED INDEX [faq_category_vendor_profile_id_idx] ON [dbo].[faq_category]([vendor_profile_id]);
DROP INDEX [operating_term_vendor_profile_id_idx] ON [dbo].[operating_term];
DECLARE @SQL_OPERATING_TERM NVARCHAR(MAX) = N''
SELECT @SQL_OPERATING_TERM += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'operating_term'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL_OPERATING_TERM
;
CREATE TABLE [dbo].[_prisma_new_operating_term] (
    [id] INT NOT NULL IDENTITY(1,1),
    [vendor_profile_id] UNIQUEIDENTIFIER NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [sort_order] INT NOT NULL CONSTRAINT [operating_term_sort_order_df] DEFAULT 1,
    [is_active] BIT NOT NULL CONSTRAINT [operating_term_is_active_df] DEFAULT 1,
    CONSTRAINT [operating_term_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_operating_term] ON;
IF EXISTS(SELECT * FROM [dbo].[operating_term])
    EXEC('INSERT INTO [dbo].[_prisma_new_operating_term] ([content],[id],[is_active],[sort_order],[title],[vendor_profile_id]) SELECT [content],[id],[is_active],[sort_order],[title],[vendor_profile_id] FROM [dbo].[operating_term] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_operating_term] OFF;
DROP TABLE [dbo].[operating_term];
EXEC SP_RENAME N'dbo._prisma_new_operating_term', N'operating_term';
CREATE NONCLUSTERED INDEX [operating_term_vendor_profile_id_idx] ON [dbo].[operating_term]([vendor_profile_id]);
DROP INDEX [vendor_banner_vendor_profile_id_idx] ON [dbo].[vendor_banner];
DECLARE @SQL_VENDOR_BANNER NVARCHAR(MAX) = N''
SELECT @SQL_VENDOR_BANNER += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'vendor_banner'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL_VENDOR_BANNER
;
CREATE TABLE [dbo].[_prisma_new_vendor_banner] (
    [id] INT NOT NULL IDENTITY(1,1),
    [vendor_profile_id] UNIQUEIDENTIFIER NOT NULL,
    [image_url] NVARCHAR(1000) NOT NULL,
    [sort_order] INT NOT NULL CONSTRAINT [vendor_banner_sort_order_df] DEFAULT 1,
    CONSTRAINT [vendor_banner_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_vendor_banner] ON;
IF EXISTS(SELECT * FROM [dbo].[vendor_banner])
    EXEC('INSERT INTO [dbo].[_prisma_new_vendor_banner] ([id],[image_url],[sort_order],[vendor_profile_id]) SELECT [id],[image_url],[sort_order],[vendor_profile_id] FROM [dbo].[vendor_banner] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_vendor_banner] OFF;
DROP TABLE [dbo].[vendor_banner];
EXEC SP_RENAME N'dbo._prisma_new_vendor_banner', N'vendor_banner';
CREATE NONCLUSTERED INDEX [vendor_banner_vendor_profile_id_idx] ON [dbo].[vendor_banner]([vendor_profile_id]);
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
