// import dotenv from "dotenv";
// import cors from "cors";
//
// dotenv.config();
//
// import express, { Request, Response } from "express";
// import cookieParser from "cookie-parser";
//
// const PORT = process.env.API_PORT || 7070;
//
// const app = express();
// import db from "./db";
//
// app.use(cors());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cookieParser());
//
// import apiRoute from "./route/api";
//
// app.use("/api", apiRoute);
//
// app.all("*", (_req: Request, res: Response) => {
//   return res.status(404).json({
//     code: 404,
//     status: "Not found",
//     message: "Page not found",
//   });
// });
//
// db.once("open", () => {
//   app.listen(PORT, () => {
//     console.log(`Server running at port: ${PORT}`);
//   });
// });

import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import ExpressMongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import passport from "passport";
import { jwtStrategy } from "./modules/auth";
import { ApiError, errorConverter, errorHandler } from "./modules/error";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import routes from "./routes";

const app: Express = express();

app.use(helmet());

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(ExpressMongoSanitize());

app.use(compression());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/api", routes);

app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
