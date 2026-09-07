BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[sys_stop] (
    [stop_id] INT NOT NULL IDENTITY(1,1),
    [bv_stop_code] NVARCHAR(10) NOT NULL,
    [op_stop_code] NVARCHAR(10) NOT NULL,
    [stop_full_name] NVARCHAR(50) NOT NULL,
    [stop_name] NVARCHAR(50) NOT NULL,
    [gps1_x] NVARCHAR(10) NOT NULL,
    [gps1_y] NVARCHAR(10) NOT NULL,
    [gps2_x] NVARCHAR(10) NOT NULL,
    [gps2_y] NVARCHAR(10) NOT NULL,
    [gps_memo] NVARCHAR(255) NOT NULL,
    [free_bus_area_code] NVARCHAR(20) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [sys_stop_is_active_df] DEFAULT 1,
    [update_time] DATETIME2 NOT NULL,
    [update_user_id] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [sys_stop_pkey] PRIMARY KEY CLUSTERED ([stop_id])
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
