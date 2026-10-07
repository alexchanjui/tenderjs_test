-- 保留現有頁面、角色權限與 API 權限資料。
BEGIN TRY
BEGIN TRAN;

EXEC sp_rename N'dbo.page_group', N'page';
EXEC sp_rename N'dbo.role_page_group', N'role_page';
EXEC sp_rename N'dbo.page.page_group_code', N'page_code', N'COLUMN';
EXEC sp_rename N'dbo.role_page.page_group_code', N'page_code', N'COLUMN';
EXEC sp_rename N'dbo.permission.page_group_code', N'page_code', N'COLUMN';
EXEC sp_rename N'dbo.page_group_pkey', N'page_pkey', N'OBJECT';
EXEC sp_rename N'dbo.role_page_group_pkey', N'role_page_pkey', N'OBJECT';
EXEC sp_rename N'dbo.role_page_group_role_id_fkey', N'role_page_role_id_fkey', N'OBJECT';
EXEC sp_rename N'dbo.role_page_group_page_group_code_fkey', N'role_page_page_code_fkey', N'OBJECT';
EXEC sp_rename N'dbo.page_group_is_active_df', N'page_is_active_df', N'OBJECT';
EXEC sp_rename N'dbo.page_group_create_time_df', N'page_create_time_df', N'OBJECT';
EXEC sp_rename N'dbo.permission.permission_page_group_code_idx', N'permission_page_code_idx', N'INDEX';

ALTER TABLE [dbo].[page] DROP CONSTRAINT [page_group_sort_order_df];
ALTER TABLE [dbo].[page] DROP COLUMN [sort_order];

UPDATE [dbo].[page]
SET [route_path] = N'/pages'
WHERE [route_path] = N'/page-groups';

UPDATE [dbo].[page] SET [name] = N'頁面管理'
WHERE [name] = N'頁面群組管理';
UPDATE [dbo].[page] SET [description] = REPLACE([description], N'頁面群組', N'頁面')
WHERE [description] LIKE N'%頁面群組%';

UPDATE [dbo].[permission]
SET [api_path] = REPLACE(REPLACE([api_path], N'/api/page-groups', N'/api/pages'), N':pageGroupCode', N':pageCode')
WHERE [api_path] = N'/api/page-groups' OR [api_path] LIKE N'/api/page-groups/%';
UPDATE [dbo].[permission]
SET [name] = N'page:' + SUBSTRING([name], 12, LEN([name]))
WHERE [name] LIKE N'page-group:%';
UPDATE [dbo].[permission]
SET [description] = REPLACE([description], N'頁面群組', N'頁面')
WHERE [description] LIKE N'%頁面群組%';

COMMIT TRAN;
END TRY
BEGIN CATCH
IF @@TRANCOUNT > 0 ROLLBACK TRAN;
THROW;
END CATCH
