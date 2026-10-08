-- 保留既有頁面與權限；先回填 ID，再移除舊代碼關聯。
BEGIN TRY
BEGIN TRAN;

IF EXISTS (
    SELECT 1 FROM [dbo].[permission] AS permission
    LEFT JOIN [dbo].[page] AS page ON page.[page_code] = permission.[page_code]
    WHERE permission.[page_code] <> 0 AND page.[page_code] IS NULL
)
    THROW 50001, N'存在找不到頁面的 API 權限，請先修正 page_code 再執行 migration。', 1;

ALTER TABLE [dbo].[page] ADD [id] INT IDENTITY(1,1) NOT NULL;
ALTER TABLE [dbo].[role_page] ADD [page_id] INT NULL;
ALTER TABLE [dbo].[permission] ADD [page_id] INT NULL;

EXEC(N'UPDATE rp SET [page_id] = p.[id]
FROM [dbo].[role_page] rp JOIN [dbo].[page] p ON p.[page_code] = rp.[page_code]');
EXEC(N'UPDATE permission SET [page_id] = page.[id]
FROM [dbo].[permission] permission JOIN [dbo].[page] page ON page.[page_code] = permission.[page_code]
WHERE permission.[page_code] <> 0');

ALTER TABLE [dbo].[role_page] DROP CONSTRAINT [role_page_page_code_fkey];
ALTER TABLE [dbo].[role_page] DROP CONSTRAINT [role_page_pkey];
ALTER TABLE [dbo].[page] DROP CONSTRAINT [page_pkey];
DROP INDEX [permission_page_code_idx] ON [dbo].[permission];

ALTER TABLE [dbo].[page] ADD CONSTRAINT [page_pkey] PRIMARY KEY CLUSTERED ([id]);
ALTER TABLE [dbo].[page] ADD CONSTRAINT [page_page_code_key] UNIQUE NONCLUSTERED ([page_code]);
ALTER TABLE [dbo].[role_page] ALTER COLUMN [page_id] INT NOT NULL;
ALTER TABLE [dbo].[role_page] DROP COLUMN [page_code];
ALTER TABLE [dbo].[permission] DROP COLUMN [page_code];

ALTER TABLE [dbo].[role_page] ADD CONSTRAINT [role_page_pkey] PRIMARY KEY CLUSTERED ([role_id], [page_id]);
ALTER TABLE [dbo].[role_page] ADD CONSTRAINT [role_page_page_id_fkey]
FOREIGN KEY ([page_id]) REFERENCES [dbo].[page]([id]) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE [dbo].[permission] ADD CONSTRAINT [permission_page_id_fkey]
FOREIGN KEY ([page_id]) REFERENCES [dbo].[page]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE NONCLUSTERED INDEX [permission_page_id_idx] ON [dbo].[permission]([page_id]);

UPDATE [dbo].[permission] SET [api_path] = N'/api/pages/:id'
WHERE [api_path] = N'/api/pages/:pageCode';

COMMIT TRAN;
END TRY
BEGIN CATCH
IF @@TRANCOUNT > 0 ROLLBACK TRAN;
THROW;
END CATCH
