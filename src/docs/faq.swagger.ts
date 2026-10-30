// src/docs/faq.swagger.ts

/**
 * @openapi
 * /faq-categories:
 *   get:
 *     tags: [FAQ]
 *     summary: 取得問答分類列表
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/NodeIdHeader"
 *     responses:
 *       200:
 *         description: 成功
 *
 *   post:
 *     tags: [FAQ]
 *     summary: 新增問答分類
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/NodeIdHeader"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: 問題
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 新增成功
 *
 * /faq-categories/{id}:
 *   put:
 *     tags: [FAQ]
 *     summary: 更新問答分類
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 問題
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 更新成功
 *
 *   delete:
 *     tags: [FAQ]
 *     summary: 刪除問答分類
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 刪除成功
 *
 * /faqs:
 *   get:
 *     tags: [FAQ]
 *     summary: 取得問答列表
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: true
 *         description: 問答分類 ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 成功
 *
 *   post:
 *     tags: [FAQ]
 *     summary: 新增問答
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - title
 *               - content
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: 如何購買票券？
 *               content:
 *                 type: string
 *                 example: 請至票券購買頁面進行購買。
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 新增成功
 *
 * /faqs/{id}:
 *   put:
 *     tags: [FAQ]
 *     summary: 更新問答
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: 如何購買票券？
 *               content:
 *                 type: string
 *                 example: 請至票券購買頁面進行購買。
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 更新成功
 *
 *   delete:
 *     tags: [FAQ]
 *     summary: 刪除問答
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 刪除成功
 */
