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
 *     tags: [Users]
 *     summary: 建立使用者
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 20
 *                 example: test
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 16
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: 取得當前使用者詳細資料
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */
export {};
