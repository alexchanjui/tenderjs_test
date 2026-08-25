BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[audit_log] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [user_id] UNIQUEIDENTIFIER,
    [action] VARCHAR(200) NOT NULL,
    [ip_address] VARCHAR(45),
    [user_agent] NVARCHAR(max),
    [status_code] INT NOT NULL,
    [biz_code] INT NOT NULL CONSTRAINT [audit_log_biz_code_df] DEFAULT 0,
    [req_data] NVARCHAR(max),
    [res_data] NVARCHAR(max),
    [duration] INT NOT NULL CONSTRAINT [audit_log_duration_df] DEFAULT 0,
    [is_success] BIT NOT NULL CONSTRAINT [audit_log_is_success_df] DEFAULT 1,
    [create_time] DATETIME2 NOT NULL CONSTRAINT [audit_log_create_time_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [audit_log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_log_user_id_idx] ON [dbo].[audit_log]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_log_create_time_idx] ON [dbo].[audit_log]([create_time]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_log_status_code_idx] ON [dbo].[audit_log]([status_code]);

-- AddForeignKey
ALTER TABLE [dbo].[audit_log] ADD CONSTRAINT [audit_log_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
