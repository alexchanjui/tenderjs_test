// src/docs/options.swagger.ts

/**
 * @openapi
 * /options/roles:
 *   get:
 *     tags:
 *       - Options
 *     summary: 取得角色選項
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/NodeIdHeader"
 *     responses:
 *       200:
 *         description: 查詢成功
 */

/**
 * @openapi
 * /options/pages:
 *   get:
 *     tags:
 *       - Options
 *     summary: 取得頁面選項
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 查詢成功
 */

/**
 * @openapi
 * /options/nodes:
 *   get:
 *     tags:
 *       - Options
 *     summary: 取得組織節點選項
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 查詢成功
 */

/**
 * @openapi
 * /options/faq-categories:
 *   get:
 *     tags:
 *       - Options
 *     summary: 取得問題分類選項
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/NodeIdHeader"
 *     responses:
 *       200:
 *         description: 查詢成功
 */
