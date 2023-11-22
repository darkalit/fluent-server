import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import pick from "../utils/pick";
import { IOptions } from "../paginate/paginate";
import { wordService } from ".";
import mongoose from "mongoose";
import { ApiError } from "../error";
import httpStatus from "http-status";
import { userService } from "../user";
import { userStatService } from "../userStat";

export const getWords = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["ukr", "eng", "category", "theme"]);
  const options: IOptions = pick(req.query, [
    "sortBy",
    "limit",
    "page",
    "projectBy",
  ]);

  const result = await wordService.queryWords(filter, options);
  res.send(result);
});

export const getWord = catchAsync(async (req: Request, res: Response) => {
  const word = await wordService.getWordById(
    new mongoose.Types.ObjectId(req.params["wordId"]),
  );
  if (!word) {
    throw new ApiError(httpStatus.NOT_FOUND, "Word not found");
  }
  res.send(word);
});

export const genWords = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params["userId"] === "string") {
    const user = await userService.getUserById(
      new mongoose.Types.ObjectId(req.params["userId"]),
    );
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const words = await wordService.getWords(user._id);

    for await (const e of words) {
      await userStatService.addWordByUserId(user._id, e._id);
    }

    res.send(words);
  }
});
