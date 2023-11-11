import express, { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerDefinition from "../modules/swagger/swagger.definition";

const router: Router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ["packages/components.yaml", "build/routes/*.js"],
});

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  }),
);

export default router;
