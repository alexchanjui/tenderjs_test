// src/docs/auth.swagger.ts

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: 身分驗證。
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: 使用者登入
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, captchaId, captcha]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "password123"
 *               captchaId:
 *                 type: string
 *               captcha:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功。user 會包含 userType、vendorId、roleId。
 */

/**
 * @openapi
 * /auth/captcha:
 *   get:
 *     tags: [Auth]
 *     summary: 取得登入驗證碼
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /auth/auto-login:
 *   post:
 *     tags: [Auth]
 *     summary: 自動登入
 *     description: 僅開發環境使用。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 成功
 */
