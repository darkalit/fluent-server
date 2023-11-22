import mongoose from "mongoose";
import {
  IUserStatDoc,
  NewCreatedUserStat,
  UpdateUserStatBody,
} from "./userStat.interfaces";
import UserStat from "./userStat.model";
import { ApiError } from "../error";
import httpStatus from "http-status";
import mergeDeep from "../utils/mergeDeep";
import config from "../../config/config";
import { wordService } from "../word";
import { Theme } from "../theme";

export async function createUserStat(
  userStatBody: NewCreatedUserStat,
): Promise<IUserStatDoc> {
  return UserStat.create(userStatBody);
}

export async function getUserStatByUserId(
  userId: mongoose.Types.ObjectId,
): Promise<IUserStatDoc | null> {
  return UserStat.findOne({ user: userId });
}

export async function updateUserStatByUserId(
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserStatBody,
): Promise<IUserStatDoc | null> {
  const userStat = await getUserStatByUserId(userId);
  if (!userStat) {
    throw new ApiError(httpStatus.NOT_FOUND, "UserStat not found");
  }

  mergeDeep(userStat, updateBody);
  await userStat.save();
  return userStat;
}

export async function changeThemes(
  userId: mongoose.Types.ObjectId,
  themesIds: mongoose.Types.ObjectId[],
): Promise<IUserStatDoc> {
  const userStat = await getUserStatByUserId(userId);
  if (!userStat) {
    throw new ApiError(httpStatus.NOT_FOUND, "UserStat not found");
  }

  for await (const e of themesIds) {
    const exists = await Theme.exists({ _id: e });
    if (!exists) {
      throw new ApiError(httpStatus.NOT_FOUND, "Theme not found");
    }
  }

  userStat.selected.themes = themesIds;
  await userStat.save();
  return userStat;
}

export async function changeWordsDailyCount(
  userId: mongoose.Types.ObjectId,
  count: number,
): Promise<IUserStatDoc> {
  const userStat = await getUserStatByUserId(userId);
  if (!userStat) {
    throw new ApiError(httpStatus.NOT_FOUND, "UserStat not found");
  }

  if (count <= 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Count cant be less or equal than 0",
    );
  }

  userStat.selected.daily_words_count = count;
  await userStat.save();
  return userStat;
}

export async function addWordByUserId(
  userId: mongoose.Types.ObjectId,
  wordId: mongoose.Types.ObjectId,
): Promise<IUserStatDoc> {
  const userStat = await getUserStatByUserId(userId);
  if (!userStat) {
    throw new ApiError(httpStatus.NOT_FOUND, "UserStat not found");
  }

  const word = await wordService.getWordById(wordId);
  if (!word) {
    throw new ApiError(httpStatus.NOT_FOUND, "Word not found");
  }

  userStat.word_progress.set(word.id, 0);

  await userStat.save();
  return userStat;
}

export async function addPointsForWordByUserId(
  userId: mongoose.Types.ObjectId,
  wordId: mongoose.Types.ObjectId,
  points: number,
): Promise<IUserStatDoc | null> {
  const userStat = await getUserStatByUserId(userId);
  if (!userStat) {
    throw new ApiError(httpStatus.NOT_FOUND, "UserStat not found");
  }

  // const wordIndex = userStat.word_progress.findIndex((val) => {
  //   return val.word == wordId;
  // });
  // if (wordIndex === -1) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "Word not found");
  // }
  //
  // // @ts-expect-error
  // userStat.word_progress[wordIndex].progress = Math.min(
  //   // @ts-expect-error
  //   Math.max(userStat.word_progress[wordIndex].progress + points, 0),
  //   config.maxPoints,
  // );

  if (userStat.word_progress.get(wordId) === undefined) {
    throw new ApiError(httpStatus.NOT_FOUND, "Word not found in UserStat");
  }

  userStat.word_progress.set(
    wordId,
    Math.min(
      // @ts-expect-error
      Math.max(userStat.word_progress.get(wordId) + points, 0),
      config.maxPoints,
    ),
  );

  userStat.save();

  return userStat;
}
