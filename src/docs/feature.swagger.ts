// src/docs/feature.swagger.ts

/**
 * @openapi
 * /features:
 *   get:
 *     tags: [Features]
 *     summary: 取得頁面功能列表
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
 *     tags: [Features]
 *     summary: 建立頁面功能
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - featureCode
 *               - name
 *             properties:
 *               featureCode:
 *                 type: integer
 *                 example: 500
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: 報表管理
 *               routePath:
 *                 type: string
 *                 example: /reports
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *                 example: 5
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /features/{featureCode}:
 *   get:
 *     tags: [Features]
 *     summary: 取得頁面功能詳細資訊
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: featureCode
 *         required: true
 *         schema:
 *           type: integer
 *         example: 100
 *     responses:
 *       200:
 *         description: 成功
 *
 *   put:
 *     tags: [Features]
 *     summary: 更新頁面功能
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: featureCode
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
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: 使用者管理
 *               routePath:
 *                 type: string
 *                 example: /users
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /features/batch:
 *   delete:
 *     tags: [Features]
 *     summary: 批次刪除頁面功能
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
