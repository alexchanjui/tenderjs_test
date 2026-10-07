// src/docs/page.swagger.ts

/**
 * @openapi
 * /pages:
 *   get:
 *     tags: [Pages]
 *     summary: 取得頁面列表
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
 *     tags: [Pages]
 *     summary: 建立頁面
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageCode
 *               - name
 *               - routePath
 *             properties:
 *               pageCode:
 *                 type: integer
 *                 example: 500
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: 報表管理
 *               description:
 *                 type: string
 *                 example: 報表相關頁面
 *               routePath:
 *                 type: string
 *                 example: /reports
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /pages/{id}:
 *   get:
 *     tags: [Pages]
 *     summary: 取得頁面詳細資訊
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 100
 *     responses:
 *       200:
 *         description: 成功
 *
 *   put:
 *     tags: [Pages]
 *     summary: 更新頁面
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 100
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageCode:
 *                 type: integer
 *                 example: 300
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: 使用者管理
 *               description:
 *                 type: string
 *                 example: 使用者管理相關頁面
 *               routePath:
 *                 type: string
 *                 example: /users
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /pages/batch:
 *   delete:
 *     tags: [Pages]
 *     summary: 批次刪除頁面
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
 *                   type: integer
 *                 example: [300, 400]
 *     responses:
 *       200:
 *         description: 成功
 */
