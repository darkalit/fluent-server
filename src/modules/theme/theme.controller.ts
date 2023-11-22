import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { IOptions as IOptionsAggr } from "../paginate/aggregatePaginate";
import pick from "../utils/pick";
import { themeService } from ".";
import { userService } from "../user";
import mongoose from "mongoose";
import { ApiError } from "../error";
import httpStatus from "http-status";

export const getThemesByUserProgress = catchAsync(
  async (req: Request, res: Response) => {
    const options: IOptionsAggr = pick(req.query, [
      "sortBy",
      "limit",
      "page",
      "projectBy",
    ]);
    options.allowDiskUse = true;

    if (typeof req.params["userId"] === "string") {
      const user = await userService.getUserById(
        new mongoose.Types.ObjectId(req.params["userId"]),
      );
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }

      const themes = await themeService.getThemesProgressByUserId(
        user.id,
        options,
      );

      res.send(themes);
    }
  },
);
