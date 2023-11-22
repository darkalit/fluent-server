import catchAsync from "../modules/utils/catchAsync";
import upload from "../modules/upload";
import express, { Request, Response, Router, NextFunction } from "express";
import httpStatus from "http-status";
import { ApiError } from "../modules/error";
import { MulterError } from "multer";

const router: Router = express.Router();

router
  .route("/")
  .post(
    upload.single("image"),
    (err: Error, _req: Request, res: Response, next: NextFunction) => {
      if (err instanceof MulterError) {
        res.sendStatus(httpStatus.REQUEST_ENTITY_TOO_LARGE);
      } else {
        next();
      }
    },
    catchAsync(async (req: Request, res: Response) => {
      if (!req.file)
        throw new ApiError(httpStatus.BAD_REQUEST, "No file");
      res.sendStatus(httpStatus.CREATED);
    }),
  );

export default router;
