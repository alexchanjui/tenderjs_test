// src/docs/permission.swagger.ts

/**
 * @openapi
 * tags:
 *   - name: Permissions
 *     description: API 權限管理，提供業者與角色權限設定使用。
 */

/**
 * @openapi
 * /permissions:
 *   post:
 *     tags: [Permissions]
 *     summary: 建立權限
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - apiPath
 *               - actionType
 *             properties:
 *               pageId:
 *                 type: integer
 *                 nullable: true
 *                 description: 頁面描述
 *                 example: 100
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: 查看使用者
 *               apiPath:
 *                 type: string
 *                 example: /api/users
 *               actionType:
 *                 type: integer
 *                 description: 0=GET, 1=POST, 2=PUT, 3=DELETE
 *                 example: 0
 *               isRequired:
 *                 type: boolean
 *                 description: 是否需要登入及權限驗證
 *                 example: true
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: 查看使用者列表
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /permissions/all:
 *   get:
 *     tags: [Permissions]
 *     summary: 取得所有權限
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /permissions/{id}:
 *   get:
 *     tags: [Permissions]
 *     summary: 取得權限詳細資訊
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功
 *
 *   put:
 *     tags: [Permissions]
 *     summary: 更新權限
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: integer
 *                 nullable: true
 *                 description: 頁面描述
 *                 example: 100
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: 查看使用者
 *               apiPath:
 *                 type: string
 *                 example: /api/users
 *               actionType:
 *                 type: integer
 *                 description: 0=GET, 1=POST, 2=PUT, 3=DELETE
 *                 example: 0
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               isRequired:
 *                 type: boolean
 *                 description: 是否需要登入及權限驗證
 *                 example: true
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: 查看使用者列表
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /permissions/batch:
 *   delete:
 *     tags: [Permissions]
 *     summary: 批次刪除權限
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
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 成功
 */
