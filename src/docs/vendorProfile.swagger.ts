// src/docs/vendorProfile.swagger.ts

/**
 * @openapi
 * /vendor-profile:
 *   get:
 *     tags: [Vendor Profile]
 *     summary: 取得業者詳細資訊
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nodeId
 *         required: false
 *         description: 節點 ID，營運可指定查詢節點；未指定則查詢自己的節點
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 成功
 *
 *   put:
 *     tags: [Vendor Profile]
 *     summary: 新增或更新業者詳細資訊
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nodeId
 *               - brandName
 *               - banners
 *             properties:
 *               nodeId:
 *                 type: string
 *                 format: uuid
 *                 description: 業者所屬節點 ID
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               brandName:
 *                 type: string
 *                 example: 測試品牌
 *               description:
 *                 type: string
 *                 example: 品牌介紹
 *               brandImage:
 *                 type: string
 *                 example: /res/images/vendor/brand.png
 *               phone:
 *                 type: string
 *                 example: "02-12345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: vendor@example.com
 *               address:
 *                 type: string
 *                 example: 台北市信義區
 *               banners:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: object
 *                   required:
 *                     - imageUrl
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: /res/images/vendor/banner.png
 *                     sortOrder:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: 成功
 */
