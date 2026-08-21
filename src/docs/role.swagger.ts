// src/docs/role.swagger.ts

/**
 * @openapi
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: 取得角色列表
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
 *     tags: [Roles]
 *     summary: 建立角色
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
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Admin
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: 系統管理員
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: 取得角色詳細資料
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
 *         description: 成功
 *
 *   put:
 *     tags: [Roles]
 *     summary: 更新角色
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
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Manager
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: 管理者
 *     responses:
 *       200:
 *         description: 成功
 *
 *   delete:
 *     tags: [Roles]
 *     summary: 刪除角色
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
 *         description: 成功
 */

/**
 * @openapi
 * /roles/{id}/permissions:
 *   put:
 *     tags: [Roles]
 *     summary: 更新角色權限
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
 *             required:
 *               - settings
 *             properties:
 *               settings:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - featureCode
 *                     - accessLevel
 *                   properties:
 *                     featureCode:
 *                       type: integer
 *                       example: 1001
 *                     accessLevel:
 *                       type: string
 *                       enum: [NONE, VIEW, EDIT]
 *                       example: VIEW
 *     responses:
 *       200:
 *         description: 成功
 */

export {};
