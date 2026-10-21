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
 *       - in: query
 *         name: nodeId
 *         required: false
 *         description: 節點 ID，營運可指定操作節點；未指定則操作自己的節點
 *         schema:
 *           type: string
 *           format: uuid
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
 *               nodeId:
 *                 type: string
 *                 format: uuid
 *                 description: 節點 ID，營運可指定操作節點；未指定則操作自己的節點
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
 *       - in: query
 *         name: nodeId
 *         required: false
 *         description: 節點 ID，營運可指定操作節點；未指定則操作自己的節點
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
 *       - in: query
 *         name: nodeId
 *         required: false
 *         description: 節點 ID，營運可指定操作節點；未指定則操作自己的節點
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
 *     parameters:
 *       - in: query
 *         name: nodeId
 *         required: false
 *         description: 節點 ID，營運可指定操作節點；未指定則操作自己的節點
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
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /roles/{id}/pages:
 *   put:
 *     tags: [Roles]
 *     summary: 更新角色頁面使用
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: nodeId
 *         required: false
 *         description: 節點 ID，營運可指定操作節點；未指定則操作自己的節點
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
 *                 description: 角色可使用的頁面代碼；空陣列代表無任何頁面權限
 *                 items:
 *                   type: integer
 *                 example: [100, 200, 300]
 *     responses:
 *       200:
 *         description: 成功
 */
