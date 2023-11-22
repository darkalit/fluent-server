import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { userService } from "../user";
import httpStatus from "http-status";
import { ApiError } from "../error";
import mongoose from "mongoose";
import { userStatService } from ".";
// import mongoose from "mongoose";

export const genWords = catchAsync(async (req: Request, res: Response) => {
  // const word = await Word.aggregate([{ $sample: { size: 1 }}]);

  // await userStatService.addWordByUserId(req.params["userId"], word[0]._id);

  // res.send(await userStatService.getUserStatByUserId(req.params["userId"]))

  if (typeof req.params["userId"] === "string") {
    const user = await userService.getUserById(
      new mongoose.Types.ObjectId(req.params["userId"]),
    );
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    res.send(user);
  }
});

export const changeThemes = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params["userId"] === "string") {
    const user = await userService.getUserById(
      new mongoose.Types.ObjectId(req.params["userId"]),
    );
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const themes = req.body.themes.map((e: string) =>
      new mongoose.Types.ObjectId(e)
    );

    userStatService.changeThemes(user._id, themes);

    res.sendStatus(httpStatus.OK);
  }
});

export const changeWordsDailyCount = catchAsync(
  async (req: Request, res: Response) => {
    if (typeof req.params["userId"] === "string") {
      const user = await userService.getUserById(
        new mongoose.Types.ObjectId(req.params["userId"]),
      );
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }

      const wordsCount = req.body.wordsCount;

      userStatService.changeWordsDailyCount(user._id, wordsCount);

      res.sendStatus(httpStatus.OK);
    }
  },
);

// export const updateUserStat = catchAsync(
//   async (req: Request, res: Response) => {
//     if (typeof req.params["userId"] === "string") {
//       const userStatDoc = await userStatService.updateUserStatByUserId(
//         new mongoose.Types.ObjectId(req.params["userId"]),
//         req.body,
//       );
//       res.send(userStatDoc);
//     }
//   },
// );
