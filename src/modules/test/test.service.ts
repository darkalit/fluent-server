import mongoose from "mongoose";
import {
  ETestType,
  IAnswer,
  IChooseTest,
  IEnterTest,
  ITest,
  ITestDoc,
} from "./test.interfaces";
import { Word } from "../word";
import { ApiError } from "../error";
import httpStatus from "http-status";
import { randInt } from "../utils/random";
import Test from "./test.model";
import { userService } from "../user";
import { userStatService } from "../userStat";

export async function getEnterTest(
  wordId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
): Promise<IEnterTest> {
  const wordDoc = await Word.findOne({ _id: wordId });
  if (!wordDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Word not found");
  }

  const userDoc = userService.getUserById(userId);
  if (!userDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const testDoc = await createTest({
    user: userId,
    word: wordDoc._id,
    type: ETestType.Enter,
    correct: wordDoc.eng,
  });

  return {
    test: testDoc._id,
    correct: wordDoc.eng,
    variant: wordDoc,
  };
}

export async function getChooseTest(
  wordId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
): Promise<IChooseTest> {
  const wordDoc = await Word.findOne({ _id: wordId });
  if (!wordDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Word not found");
  }

  const userDoc = userService.getUserById(userId);
  if (!userDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const pipeline = [
    {
      $match: {
        _id: {
          $ne: wordId,
        },
      },
    },
    {
      $sample: {
        size: 3,
      },
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];

  const randomWords = await Word.aggregate(pipeline);

  const randIndex = randInt(0, 3);

  randomWords.splice(randIndex, 0, wordDoc);

  const testDoc = await createTest({
    user: userId,
    word: wordDoc._id,
    type: ETestType.Choose,
    correct: randIndex,
  });

  return {
    test: testDoc._id,
    correct: randIndex,
    variants: randomWords,
  };
}

export async function createTest(testBody: ITest): Promise<ITestDoc> {
  return Test.create(testBody);
}

export async function answerTest(answerBody: IAnswer): Promise<boolean> {
  const testDoc = await Test.findOne({
    _id: answerBody.test,
    user: answerBody.user,
  });
  if (!testDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Test not found");
  }

  const points = testDoc.correct === answerBody.correct ? 1 : -1;

  userStatService.addPointsForWordByUserId(
    answerBody.user,
    testDoc.word,
    points,
  );

  return testDoc.correct === answerBody.correct;
}
