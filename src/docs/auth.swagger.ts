// src/docs/auth.swagger.ts

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
 *             required:
 *               - username
 *               - password
 *               - captchaId
 *               - captcha
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "password123"
 *               captchaId:
 *                 type: string
 *                 example: "abc-123"
 *               captcha:
 *                 type: string
 *                 example: "xyz789"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
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
export {};
