BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[user] DROP CONSTRAINT [user_role_id_fkey];

-- DropIndex
ALTER TABLE [dbo].[role] DROP CONSTRAINT [role_name_key];

-- AlterTable
ALTER TABLE [dbo].[role] ADD [vendor_id] UNIQUEIDENTIFIER;

-- AlterTable
ALTER TABLE [dbo].[user] ADD [vendor_id] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[vendor] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [vendor_id_df] DEFAULT newid(),
    [code] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [is_active] BIT NOT NULL CONSTRAINT [vendor_is_active_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [vendor_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [vendor_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [vendor_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[vendor_page] (
    [vendor_id] UNIQUEIDENTIFIER NOT NULL,
    [page_id] INT NOT NULL,
    CONSTRAINT [vendor_page_pkey] PRIMARY KEY CLUSTERED ([vendor_id],[page_id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [role_vendor_id_idx] ON [dbo].[role]([vendor_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [user_vendor_id_idx] ON [dbo].[user]([vendor_id]);

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_vendor_id_fkey] FOREIGN KEY ([vendor_id]) REFERENCES [dbo].[vendor]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[role] ADD CONSTRAINT [role_vendor_id_fkey] FOREIGN KEY ([vendor_id]) REFERENCES [dbo].[vendor]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[vendor_page] ADD CONSTRAINT [vendor_page_vendor_id_fkey] FOREIGN KEY ([vendor_id]) REFERENCES [dbo].[vendor]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[vendor_page] ADD CONSTRAINT [vendor_page_page_id_fkey] FOREIGN KEY ([page_id]) REFERENCES [dbo].[page]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
