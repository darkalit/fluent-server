import mongoose from "mongoose";
import { IOptions } from "../paginate/paginate";
import { QueryResult } from "../paginate/paginate.interfaces";
import Word from "./word.model";
import { IWordDoc } from "./word.interfaces";
import { userStatService } from "../userStat";
import { ApiError } from "../error";
import httpStatus from "http-status";
import config from "../../config/config";

export async function queryWords(
  filter: Record<string, any>,
  option: IOptions,
): Promise<QueryResult> {
  const words = await Word.paginate(filter, option);
  return words;
}

export async function getWordById(
  id: mongoose.Types.ObjectId,
): Promise<IWordDoc | null> {
  return Word.findById(id);
}

export async function getWords(
  userId: mongoose.Types.ObjectId,
  newWords: boolean = true,
): Promise<IWordDoc[]> {
  const userStat = await userStatService.getUserStatByUserId(userId);
  if (!userStat) {
    throw new ApiError(httpStatus.NOT_FOUND, "UserStat not found");
  }
  const count = userStat.selected.daily_words_count;
  const themes = userStat.selected.themes;
  const word_progress = userStat.word_progress;

  let pipeline: mongoose.PipelineStage[] = [];

  if (newWords) {
    const excludedWordsIds = [...word_progress.keys()];

    pipeline = [
      {
        $match: {
          theme: {
            $in: themes,
          },
          _id: {
            $nin: excludedWordsIds,
          },
        },
      },
      {
        $sample: {
          size: count,
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
  } else {
    const includedWordsIds: mongoose.Types.ObjectId[] = [];
    for await (const e of word_progress) {
      if (e[1] < config.maxPoints) {
        includedWordsIds.push(new mongoose.Types.ObjectId(e[0]));
      }
    }

    pipeline = [
      {
        $match: {
          theme: {
            $in: themes,
          },
          _id: {
            $in: includedWordsIds,
          },
        },
      },
      {
        $sample: {
          size: count,
        },
      },
    ];
  }

  const words = await Word.aggregate(pipeline);

  return words;
}
