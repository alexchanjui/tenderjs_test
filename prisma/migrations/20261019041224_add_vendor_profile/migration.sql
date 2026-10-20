BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[vendor_profile] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [vendor_profile_id_df] DEFAULT newid(),
    [node_id] UNIQUEIDENTIFIER NOT NULL,
    [brand_name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [create_time] DATETIME2 NOT NULL CONSTRAINT [vendor_profile_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [vendor_profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [vendor_profile_node_id_key] UNIQUE NONCLUSTERED ([node_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[vendor_profile] ADD CONSTRAINT [vendor_profile_node_id_fkey] FOREIGN KEY ([node_id]) REFERENCES [dbo].[node]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
