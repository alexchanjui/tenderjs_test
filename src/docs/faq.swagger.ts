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
 *       - in: query
 *         name: nodeId
 *         required: false
 *         description: 節點 ID，營運可指定查詢節點；未指定則查詢自己的節點
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 成功
 *
 *   post:
 *     tags: [FAQ]
 *     summary: 新增問答分類
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nodeId
 *               - title
 *             properties:
 *               nodeId:
 *                 type: string
 *                 format: uuid
 *                 description: 業者所屬節點 ID
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               title:
 *                 type: string
 *                 example: 常見問題
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
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 常見問題
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
 *           type: string
 *           format: uuid
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
 *         name: nodeId
 *         required: false
 *         description: 節點 ID，營運可指定查詢節點；未指定則查詢自己的節點
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: categoryId
 *         required: true
 *         description: 問答分類 ID
 *         schema:
 *           type: string
 *           format: uuid
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
 *               - nodeId
 *               - categoryId
 *               - title
 *               - content
 *             properties:
 *               nodeId:
 *                 type: string
 *                 format: uuid
 *                 description: 業者所屬節點 ID
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               categoryId:
 *                 type: string
 *                 format: uuid
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
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
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
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 刪除成功
 */
