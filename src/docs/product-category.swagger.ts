// src/docs/product-category.swagger.ts

/**
 * @openapi
 * /product-category:
 *   get:
 *     tags: ["營運端｜Product Category"]
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
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         example: 20
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         example: 定期票
 *     responses:
 *       200:
 *         description: 成功
 *
 *   post:
 *     tags: ["營運端｜Product Category"]
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
 *                 example: 水上活動
 *               description:
 *                 type: string
 *                 maxLength: 250
 *                 example: 商品分類描述
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /product-category/{id}:
 *   get:
 *     tags: ["營運端｜Product Category"]
 *     summary: 取得商品分類詳細資訊
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: 成功
 *
 *   put:
 *     tags: ["營運端｜Product Category"]
 *     summary: 更新商品分類
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
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
 *                 example: 水上活動
 *               description:
 *                 type: string
 *                 maxLength: 250
 *                 example: 商品分類描述
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /product-category/batch:
 *   delete:
 *     tags: ["營運端｜Product Category"]
 *     summary: 批次刪除商品分類
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
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: 成功
 */
