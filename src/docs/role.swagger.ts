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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
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
 *             required: [name, scope]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Vendor Admin
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: 業者管理員
 *               scope:
 *                 type: string
 *                 enum: [PLATFORM, VENDOR]
 *                 example: VENDOR
 *               vendorId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: scope=VENDOR 時必填；PLATFORM 時不可指定
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
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               isActive:
 *                 type: boolean
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
 *             required: [ids]
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
 *     summary: 更新角色可存取頁面
 *     description: RolePage 僅表示角色是否可以進入頁面，不再使用 VIEW / EDIT / NONE。
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
 *             required: [pageIds]
 *             properties:
 *               pageIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /roles/{id}/permissions:
 *   put:
 *     tags: [Roles]
 *     summary: 更新角色 API 權限
 *     description: VENDOR 角色只能設定該 VendorPermission 已授權的 Permission。
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
 *             required: [permissionIds]
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 成功
 */
