// src/docs/stop.swagger.ts

/**
 * @openapi
 * /stops:
 *   get:
 *     tags:
 *       - Stops
 *     summary: 取得招呼站列表
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: 頁碼
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 每頁筆數
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: 查詢成功
 *
 *   post:
 *     tags:
 *       - Stops
 *     summary: 建立招呼站
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bvStopCode
 *               - opStopCode
 *               - fullName
 *               - name
 *               - gpsX
 *               - gpsY
 *             properties:
 *               bvStopCode:
 *                 type: string
 *                 example: BV001
 *                 description: 票機招呼站代碼
 *               opStopCode:
 *                 type: string
 *                 example: OP001
 *                 description: 業者招呼站代碼
 *               fullName:
 *                 type: string
 *                 example: 台北車站
 *                 description: 招呼站全名
 *               name:
 *                 type: string
 *                 example: 台北車站
 *                 description: 招呼站名稱
 *               gpsX:
 *                 type: string
 *                 example: "121.5170"
 *                 description: 經度
 *               gpsY:
 *                 type: string
 *                 example: "25.0478"
 *                 description: 緯度
 *               gps2X:
 *                 type: string
 *                 example: ""
 *                 description: 經度 2
 *               gps2Y:
 *                 type: string
 *                 example: ""
 *                 description: 緯度 2
 *               gpsMemo:
 *                 type: string
 *                 example: ""
 *                 description: GPS 備註
 *               freeBusAreaCode:
 *                 type: string
 *                 example: ""
 *                 description: 免費公車區碼
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: 啟用狀態
 *     responses:
 *       200:
 *         description: 建立成功
 */

/**
 * @openapi
 * /stops/{id}:
 *   get:
 *     tags:
 *       - Stops
 *     summary: 取得招呼站詳細資訊
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 招呼站 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 查詢成功
 *       404:
 *         description: 招呼站不存在
 *
 *   put:
 *     tags:
 *       - Stops
 *     summary: 更新招呼站
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 招呼站 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bvStopCode
 *               - opStopCode
 *               - fullName
 *               - name
 *               - gpsX
 *               - gpsY
 *             properties:
 *               bvStopCode:
 *                 type: string
 *                 example: BV001
 *                 description: 票機招呼站代碼
 *               opStopCode:
 *                 type: string
 *                 example: OP001
 *                 description: 業者招呼站代碼
 *               fullName:
 *                 type: string
 *                 example: 台北車站
 *                 description: 招呼站全名
 *               name:
 *                 type: string
 *                 example: 台北車站
 *                 description: 招呼站名稱
 *               gpsX:
 *                 type: string
 *                 example: "121.5170"
 *                 description: 經度
 *               gpsY:
 *                 type: string
 *                 example: "25.0478"
 *                 description: 緯度
 *               gps2X:
 *                 type: string
 *                 example: ""
 *                 description: 經度 2
 *               gps2Y:
 *                 type: string
 *                 example: ""
 *                 description: 緯度 2
 *               gpsMemo:
 *                 type: string
 *                 example: ""
 *                 description: GPS 備註
 *               freeBusAreaCode:
 *                 type: string
 *                 example: ""
 *                 description: 免費公車區碼
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: 啟用狀態
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 招呼站不存在
 *
 *   delete:
 *     tags:
 *       - Stops
 *     summary: 刪除招呼站
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 招呼站 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 刪除成功
 *       404:
 *         description: 招呼站不存在
 */
