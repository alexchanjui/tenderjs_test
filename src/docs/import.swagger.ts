// src/docs/import.swagger.ts

/**
 * @openapi
 * /import/stops:
 *   post:
 *     tags:
 *       - Import
 *     summary: 匯入招呼站資料
 *     description: 匯入招呼站資料
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 招呼站 Excel 檔案
 *     responses:
 *       200:
 *         description: 匯入完成
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: 成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                       description: 總筆數
 *                       example: 10
 *                     successCount:
 *                       type: integer
 *                       description: 成功筆數
 *                       example: 8
 *                     failedCount:
 *                       type: integer
 *                       description: 失敗筆數
 *                       example: 2
 *                     errors:
 *                       type: array
 *                       description: 匯入錯誤明細
 *                       items:
 *                         type: object
 *                         properties:
 *                           row:
 *                             type: integer
 *                             description: Excel 列數
 *                             example: 3
 *                           message:
 *                             type: string
 *                             description: 錯誤訊息
 *                             example: 票機招呼站代碼不能為空
 */
