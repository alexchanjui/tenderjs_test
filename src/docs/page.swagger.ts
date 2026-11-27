// src/docs/page.swagger.ts

/**
 * @openapi
 * /pages:
 *   get:
 *     tags: ["營運端｜Pages"]
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
 *         description: 頁碼
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: 每頁筆數
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           maxLength: 20
 *         description: 關鍵字
 *     responses:
 *       200:
 *         description: 成功
 *
 *   post:
 *     tags: ["營運端｜Pages"]
 *     summary: 建立頁面
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pageCode, name, routePath]
 *             properties:
 *               pageCode:
 *                 type: integer
 *                 description: 頁面代碼，建立後不可修改
 *                 example: 100
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: 使用者管理
 *               description:
 *                 type: string
 *                 example: 管理使用者資料
 *               routePath:
 *                 type: string
 *                 example: /users
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: 成功
 *
 * /pages/{id}:
 *   put:
 *     tags: ["營運端｜Pages"]
 *     summary: 更新頁面
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 頁面 ID
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
 *               description:
 *                 type: string
 *                 example: 管理使用者資料
 *               routePath:
 *                 type: string
 *                 example: /users
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 *
 *   delete:
 *     tags: ["營運端｜Pages"]
 *     summary: 刪除頁面
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 頁面 ID
 *     responses:
 *       200:
 *         description: 成功
 */
