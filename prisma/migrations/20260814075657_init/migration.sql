BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [user_id_df] DEFAULT newid(),
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [user_is_active_df] DEFAULT 1,
    [role_id] UNIQUEIDENTIFIER,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [user_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[role] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [role_id_df] DEFAULT newid(),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [is_active] BIT NOT NULL CONSTRAINT [role_is_active_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [role_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
