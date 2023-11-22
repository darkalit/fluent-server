import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { testService } from ".";
import { wordService } from "../word";
import { userService } from "../user";
import mongoose from "mongoose";
import { ApiError } from "../error";
import httpStatus from "http-status";
import { IChooseTest, IEnterTest } from "./test.interfaces";

export const getTests = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params["userId"] === "string") {
    const user = await userService.getUserById(
      new mongoose.Types.ObjectId(req.params["userId"]),
    );
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const words = await wordService.getWords(user._id, false);

    const tests: Array<IEnterTest | IChooseTest> = [];

    for await (const e of words) {
      const decision = Math.random() < 0.5;
      if (decision) {
        tests.push(await testService.getChooseTest(e._id, user._id));
      } else {
        tests.push(await testService.getEnterTest(e._id, user._id));
      }
    }

    res.send(tests);
  }
});

export const sendAnswers = catchAsync(async (req: Request, res: Response) => {
  // testService.answerTest({
  //   user
  // })
  if (typeof req.params["userId"] === "string") {
    const user = await userService.getUserById(
      new mongoose.Types.ObjectId(req.params["userId"]),
    );
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const answers = req.body.answers;
    const results = [];

    for (const e of answers) {
      const status = await testService.answerTest({
        user: user._id,
        test: new mongoose.Types.ObjectId(e.test),
        correct: e.correct,
      });

      results.push(status);
    }

    res.send(results);
  }
});
