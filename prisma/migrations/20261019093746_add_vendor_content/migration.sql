BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[vendor_profile] ADD [brand_image] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[vendor_banner] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [vendor_banner_id_df] DEFAULT newid(),
    [vendor_profile_id] UNIQUEIDENTIFIER NOT NULL,
    [image_url] NVARCHAR(1000) NOT NULL,
    [sort_order] INT NOT NULL CONSTRAINT [vendor_banner_sort_order_df] DEFAULT 1,
    CONSTRAINT [vendor_banner_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[faq_category] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [faq_category_id_df] DEFAULT newid(),
    [vendor_profile_id] UNIQUEIDENTIFIER NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [sort_order] INT NOT NULL CONSTRAINT [faq_category_sort_order_df] DEFAULT 1,
    [is_active] BIT NOT NULL CONSTRAINT [faq_category_is_active_df] DEFAULT 1,
    CONSTRAINT [faq_category_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[faq] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [faq_id_df] DEFAULT newid(),
    [category_id] UNIQUEIDENTIFIER NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [sort_order] INT NOT NULL CONSTRAINT [faq_sort_order_df] DEFAULT 1,
    [is_active] BIT NOT NULL CONSTRAINT [faq_is_active_df] DEFAULT 1,
    CONSTRAINT [faq_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[operating_term] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [operating_term_id_df] DEFAULT newid(),
    [vendor_profile_id] UNIQUEIDENTIFIER NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [sort_order] INT NOT NULL CONSTRAINT [operating_term_sort_order_df] DEFAULT 1,
    [is_active] BIT NOT NULL CONSTRAINT [operating_term_is_active_df] DEFAULT 1,
    CONSTRAINT [operating_term_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [vendor_banner_vendor_profile_id_idx] ON [dbo].[vendor_banner]([vendor_profile_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [faq_category_vendor_profile_id_idx] ON [dbo].[faq_category]([vendor_profile_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [faq_category_id_idx] ON [dbo].[faq]([category_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [operating_term_vendor_profile_id_idx] ON [dbo].[operating_term]([vendor_profile_id]);

-- AddForeignKey
ALTER TABLE [dbo].[vendor_banner] ADD CONSTRAINT [vendor_banner_vendor_profile_id_fkey] FOREIGN KEY ([vendor_profile_id]) REFERENCES [dbo].[vendor_profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[faq_category] ADD CONSTRAINT [faq_category_vendor_profile_id_fkey] FOREIGN KEY ([vendor_profile_id]) REFERENCES [dbo].[vendor_profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[faq] ADD CONSTRAINT [faq_category_id_fkey] FOREIGN KEY ([category_id]) REFERENCES [dbo].[faq_category]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[operating_term] ADD CONSTRAINT [operating_term_vendor_profile_id_fkey] FOREIGN KEY ([vendor_profile_id]) REFERENCES [dbo].[vendor_profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
