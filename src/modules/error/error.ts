import { NextFunction, Request, Response } from "express";
import ApiError from "./ApiError";
import mongoose from "mongoose";
import httpStatus from "http-status";
import config from "../../config/config";

export function errorConverter(
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof mongoose.Error
      ? httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = error.message || `${httpStatus[statusCode]}`;
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let { statusCode, message } = err;
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal server error";
  }

  res.locals["errorMessage"] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "production" && { stack: err.stack }),
  };

  if (config.env === "production") {
  }

  res.status(statusCode).send(response);
}
