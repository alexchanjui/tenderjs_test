BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[product_category] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [product_category_is_active_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [product_category_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [product_category_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [product_category_name_key] UNIQUE NONCLUSTERED ([name])
);

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
