// src/docs/user.swagger.ts

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: 取得使用者列表
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
 *     tags: [Users]
 *     summary: 建立使用者
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, nickname, email, password, userType]
 *             properties:
 *               username:
 *                 type: string
 *                 example: test
 *               nickname:
 *                 type: string
 *                 example: 測試人員
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 16
 *                 example: "12345678"
 *               userType:
 *                 type: string
 *                 enum: [PLATFORM, VENDOR]
 *                 example: VENDOR
 *               vendorId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: userType=VENDOR 時必填；PLATFORM 時不可指定
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: PLATFORM 只能使用 PLATFORM Role；VENDOR 只能使用同業者 VENDOR Role
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: 取得當前使用者詳細資訊
 *     description: 回傳 userType、vendorId、角色可存取頁面與 permissionIds。
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: 取得使用者詳細資訊
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
 *     tags: [Users]
 *     summary: 更新使用者
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
 *               username:
 *                 type: string
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               roleId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /users/batch:
 *   delete:
 *     tags: [Users]
 *     summary: 批次刪除使用者
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
