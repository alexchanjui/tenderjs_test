// src/docs/vendor.swagger.ts

/**
 * @openapi
 * /vendors:
 *   get:
 *     tags: [Vendors]
 *     summary: 取得業者列表
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         example: 20
 *     responses:
 *       200:
 *         description: 成功
 *
 *   post:
 *     tags: [Vendors]
 *     summary: 建立業者
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: VENDOR001
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: 測試業者
 *               description:
 *                 type: string
 *                 example: 測試業者說明
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
 *         example: 550e8400-e29b-41d4-a716-446655440000
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
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: 測試業者
 *               description:
 *                 type: string
 *                 example: 更新後的業者說明
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
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example:
 *                   - 550e8400-e29b-41d4-a716-446655440000
 *                   - 550e8400-e29b-41d4-a716-446655440001
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /vendors/{id}/pages:
 *   put:
 *     tags:
 *       - Vendors
 *     summary: 更新業者頁面權限
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 業者 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageCodes
 *             properties:
 *               pageCodes:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [100, 200, 300]
 *     responses:
 *       200:
 *         description: 更新成功
 */
