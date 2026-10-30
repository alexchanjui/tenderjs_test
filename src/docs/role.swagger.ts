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
 *       - $ref: "#/components/parameters/NodeIdHeader"
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
 *     parameters:
 *       - $ref: "#/components/parameters/NodeIdHeader"
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
 *                 example: "管理員"
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: "管理員角色"
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: 取得角色詳細資訊
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
 *                 example: "一般管理員"
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: "一般管理員角色"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /roles/batch:
 *   delete:
 *     tags: [Roles]
 *     summary: 批次刪除角色
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
 *                   type: string
 *                 example:
 *                   - "550e8400-e29b-41d4-a716-446655440001"
 *                   - "550e8400-e29b-41d4-a716-446655440002"
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /roles/{id}/pages:
 *   put:
 *     tags: [Roles]
 *     summary: 更新角色頁面權限
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
 *               - pageCodes
 *             properties:
 *               pageCodes:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example:
 *                   - 100
 *                   - 200
 *                   - 300
 *     responses:
 *       200:
 *         description: 成功
 */
