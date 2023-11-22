import { auth } from "../modules/auth";
import { validate } from "../modules/validate";
import { userStatController, userStatValidation } from "../modules/userStat";
import express, { Router } from "express";

const router: Router = express.Router();

router
  .route("/:userId/themes")
  .put(
    auth(),
    validate(userStatValidation.changeTheme),
    userStatController.changeThemes,
  );

router
  .route("/:userId/words")
  .put(
    auth(),
    validate(userStatValidation.changeWordsDailyCount),
    userStatController.changeWordsDailyCount,
  );

export default router;

/**
 * @swagger
 * tags:
 *   name: UserStats
 *   description: UserStat management
 */

/**
 * @swagger
 * /userstats/{id}/words:
 *   put:
 *     summary: Change daily words count
 *     description: Logged in users can change only their own information. Only admins can change other users.
 *     tags: [UserStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wordsCount
 *             properties:
 *               wordsCount:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 *       "403":
 *         $ref: "#/components/responses/Forbidden"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */

/**
 * @swagger
 * /userstats/{id}/themes:
 *   put:
 *     summary: Change chosen themes
 *     description: Logged in users can change only their own information. Only admins can change other users.
 *     tags: [UserStats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - themes
 *             properties:
 *               themes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 *       "403":
 *         $ref: "#/components/responses/Forbidden"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */
