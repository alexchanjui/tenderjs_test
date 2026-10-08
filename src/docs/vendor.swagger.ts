// src/docs/vendor.swagger.ts

/**
 * @openapi
 * /vendors:
 *   get:
 *     tags: [Vendors]
 *     summary: 取得業者列表
 *     description: 僅 PLATFORM 帳號可操作。
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: 成功
 *
 *   post:
 *     tags: [Vendors]
 *     summary: 建立業者
 *     description: 僅 PLATFORM 帳號可操作。
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name:
 *                 type: string
 *                 example: 測試旅行社
 *               code:
 *                 type: string
 *                 example: TEST_TRAVEL
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /vendors/{id}:
 *   get:
 *     tags: [Vendors]
 *     summary: 取得業者詳細資訊
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 成功
 *
 *   put:
 *     tags: [Vendors]
 *     summary: 更新業者
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 測試旅行社
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /vendors/batch:
 *   delete:
 *     tags: [Vendors]
 *     summary: 批次刪除業者
 *     description: 業者仍有帳號或角色時不可刪除。
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /vendors/{id}/permissions:
 *   get:
 *     tags: [Vendors]
 *     summary: 取得業者可用 API 權限
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 成功
 *
 *   put:
 *     tags: [Vendors]
 *     summary: 更新業者可用 API 權限
 *     description: VendorPermission 是該業者角色可取得的 API 權限上限。
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permissionIds]
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 uniqueItems: true
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 成功
 */
