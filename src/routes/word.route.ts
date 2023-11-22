import { wordController, wordValidation } from "../modules/word";
import { auth } from "../modules/auth";
import { validate } from "../modules/validate";
import express, { Router } from "express";

const router: Router = express.Router();

router
  .route("/")
  .get(
    auth("getWords"),
    validate(wordValidation.getWords),
    wordController.getWords,
  );

router
  .route("/:userId")
  .get(
    auth(),
    wordController.genWords,
  );

export default router;

/**
 * @swagger
 * tags:
 *   name: Words
 *   description: Words management and retrieval
 */

/**
 * @swagger
 * /words:
 *   get:
 *     summary: Get all words
 *     tags: [Words]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ukr
 *         schema:
 *           type: string
 *         description: Word ukrainian translation
 *       - in: query
 *         name: eng
 *         schema:
 *           type: string
 *         description: Word english translation
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Word category
 *       - in: query
 *         name: theme
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Word objectId theme
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. eng:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: Project by query in the form of field:hide/include (ex. eng:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of words
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
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
 *                     $ref: "#/components/schemas/Word"
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
 */

/**
 * @swagger
 * /words/{id}:
 *   get:
 *     summary: Get a bunch of words
 *     description: Logged in users can get only their words. Only admins can setup words of other users.
 *     tags: [Words]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Word"
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 *       "403":
 *         $ref: "#/components/responses/Forbidden"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */
