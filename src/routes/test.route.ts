import { validate } from "../modules/validate";
import { auth } from "../modules/auth";
import { testController, testValidation } from "../modules/test";
import express, { Router } from "express";

const router: Router = express.Router();

router
  .route("/:userId")
  .get(
    auth(),
    testController.getTests,
  )
  .post(
    auth(),
    validate(testValidation.sendAnswers),
    testController.sendAnswers,
  );

export default router;

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Themes retrieval
 */

/**
 * @swagger
 * /tests/{id}:
 *   get:
 *     summary: Get tests for available words
 *     tags: [Tests]
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
 *               type: array
 *               items:
 *                 anyOf:
 *                   - $ref: "#/components/schemas/EnterTest"
 *                   - $ref: "#/components/schemas/ChooseTest"
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 *       "403":
 *         $ref: "#/components/responses/Forbidden"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 *
 *   post:
 *     summary: Answer to tests
 *     tags: [Tests]
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
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     test:
 *                       type: string
 *                       format: objectId
 *                       example: 655d2ffee086b654aa327044
 *                     correct:
 *                       oneOf:
 *                        - type: integer
 *                          example: 2
 *                        - type: string
 *                          example: "Word"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: boolean
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 *       "403":
 *         $ref: "#/components/responses/Forbidden"
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */
