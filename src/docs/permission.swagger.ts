// src/docs/permission.swagger.ts

/**
 * @openapi
 * /permissions:
 *   get:
 *     tags: [Permissions]
 *     summary: 取得權限列表
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
 *               - featureCode
 *               - name
 *               - apiPath
 *               - actionType
 *             properties:
 *               featureCode:
 *                 type: integer
 *                 example: 1001
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
 * /permissions/{id}:
 *   get:
 *     tags: [Permissions]
 *     summary: 取得單一權限
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
 *               featureCode:
 *                 type: integer
 *                 example: 1001
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
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: 查看使用者列表
 *     responses:
 *       200:
 *         description: 成功
 *
 *   delete:
 *     tags: [Permissions]
 *     summary: 刪除權限
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
 */

export {};
