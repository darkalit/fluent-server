import express, { Router } from "express";
import { validate } from "../modules/validate";
import { authController, authValidation } from "../modules/auth";

const router: Router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register,
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/refresh",
  validate(authValidation.refreshTokens),
  authController.refreshTokens,
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 32
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: pass1234
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserWithTokens"
 *       "400":
 *         $ref: "#/components/responses/DuplicateEmail"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserWithTokens"
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: "#/components/responses/NotFound"
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserWithTokens"
 *       "401":
 *         $ref: "#/components/responses/Unauthorized"
 */
