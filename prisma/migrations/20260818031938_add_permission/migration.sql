BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[permission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [feature_code] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [api_path] NVARCHAR(1000) NOT NULL,
    [action_type] INT NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [permission_is_active_df] DEFAULT 1,
    [description] NVARCHAR(1000),
    [create_time] DATETIME2 NOT NULL CONSTRAINT [permission_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [permission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [permission_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [permission_api_path_action_type_key] UNIQUE NONCLUSTERED ([api_path],[action_type])
);

-- CreateTable
CREATE TABLE [dbo].[role_permissions] (
    [role_id] UNIQUEIDENTIFIER NOT NULL,
    [permission_id] INT NOT NULL,
    CONSTRAINT [role_permissions_pkey] PRIMARY KEY CLUSTERED ([role_id],[permission_id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [permission_feature_code_idx] ON [dbo].[permission]([feature_code]);

-- AddForeignKey
ALTER TABLE [dbo].[role_permissions] ADD CONSTRAINT [role_permissions_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[role_permissions] ADD CONSTRAINT [role_permissions_permission_id_fkey] FOREIGN KEY ([permission_id]) REFERENCES [dbo].[permission]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
