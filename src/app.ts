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
import { morgan } from "./modules/logger";

const app: Express = express();

app.use(morgan.errorHandler);
app.use(morgan.succesHandler);

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
