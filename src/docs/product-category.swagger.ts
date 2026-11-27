// src/docs/product-category.swagger.ts

/**
 * @openapi
 * /product-categories:
 *   get:
 *     tags: ["營運端｜Product Categories"]
 *     summary: 取得商品分類列表
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
 *     tags: ["營運端｜Product Categories"]
 *     summary: 建立商品分類
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 20
 *                 example: 戶外活動
 *               description:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 500
 *                 example: 戶外探索與自然體驗相關活動
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: 成功
 *
 * /product-categories/{id}:
 *   put:
 *     tags: ["營運端｜Product Categories"]
 *     summary: 更新商品分類
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 商品分類 ID
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
 *                 maxLength: 20
 *                 example: 戶外活動
 *               description:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 500
 *                 example: 戶外探索與自然體驗相關活動
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 *
 *   delete:
 *     tags: ["營運端｜Product Categories"]
 *     summary: 刪除商品分類
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 商品分類 ID
 *     responses:
 *       200:
 *         description: 成功
 */
