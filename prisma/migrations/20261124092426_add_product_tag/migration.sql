BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[product_tag] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(20) NOT NULL,
    [description] NVARCHAR(250),
    [is_active] BIT NOT NULL CONSTRAINT [product_tag_is_active_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [product_tag_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [product_tag_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [product_tag_name_key] UNIQUE NONCLUSTERED ([name])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
