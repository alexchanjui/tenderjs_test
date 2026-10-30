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
 *       - $ref: "#/components/parameters/NodeIdHeader"
 *     responses:
 *       200:
 *         description: 成功
 *
 *   put:
 *     tags: [Vendor Profile]
 *     summary: 新增或更新業者詳細資訊
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
 *               - brandName
 *               - banners
 *             properties:
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
