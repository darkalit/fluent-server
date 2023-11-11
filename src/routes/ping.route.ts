import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.send("pong");
});

export default router;

/**
 * @swagger
 * tags:
 *   name: Ping
 *   description: Connection check
 */

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Ping connection
 *     tags: [Ping]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           text/html; charset=utf-8:
 *             schema:
 *               type: string
 *               example: pong
 */
