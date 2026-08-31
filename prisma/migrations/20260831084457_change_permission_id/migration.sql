BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[role_permission] DROP CONSTRAINT [role_permission_permission_id_fkey];

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[permission] DROP CONSTRAINT [permission_api_path_action_type_key];
DROP INDEX [permission_feature_code_idx] ON [dbo].[permission];
ALTER TABLE [dbo].[permission] DROP CONSTRAINT [permission_name_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'permission'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_permission] (
    [id] INT NOT NULL,
    [feature_code] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [api_path] NVARCHAR(1000) NOT NULL,
    [action_type] INT NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [permission_is_active_df] DEFAULT 1,
    [is_required] BIT NOT NULL CONSTRAINT [permission_is_required_df] DEFAULT 1,
    [description] NVARCHAR(1000),
    [create_time] DATETIME2 NOT NULL CONSTRAINT [permission_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    [update_time] DATETIME2 NOT NULL,
    CONSTRAINT [permission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [permission_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [permission_api_path_action_type_key] UNIQUE NONCLUSTERED ([api_path],[action_type])
);
IF EXISTS(SELECT * FROM [dbo].[permission])
    EXEC('INSERT INTO [dbo].[_prisma_new_permission] ([action_type],[api_path],[create_time],[description],[feature_code],[id],[is_active],[is_required],[name],[update_time]) SELECT [action_type],[api_path],[create_time],[description],[feature_code],[id],[is_active],[is_required],[name],[update_time] FROM [dbo].[permission] WITH (holdlock tablockx)');
DROP TABLE [dbo].[permission];
EXEC SP_RENAME N'dbo._prisma_new_permission', N'permission';
CREATE NONCLUSTERED INDEX [permission_feature_code_idx] ON [dbo].[permission]([feature_code]);
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[role_permission] ADD CONSTRAINT [role_permission_permission_id_fkey] FOREIGN KEY ([permission_id]) REFERENCES [dbo].[permission]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
