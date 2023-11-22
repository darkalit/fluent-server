import { themeController } from "../modules/theme";
import express, { Router } from "express";

const router: Router = express.Router();

router
  .route("/byUser/:userId")
  .get(
    themeController.getThemesByUserProgress,
  );

export default router;

/**
 * @swagger
 * tags:
 *   name: Themes
 *   description: Themes retrieval
 */

/**
 * @swagger
 * /themes/byUser/{id}:
 *   get:
 *     summary: Get all available themes with their progress
 *     tags: [Themes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/ThemeByUser"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 prev:
 *                   type: integer
 *                   example: null
 *                 next:
 *                   type: integer
 *                   example: null
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 *       "403":
 *         $ref: "#/components/responses/Forbidden"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */
