import mongoose from "mongoose";
import { QueryResult } from "../paginate/paginate.interfaces";
import { IThemeDoc } from "./theme.interfaces";
import Theme from "./theme.model";
import { IOptions as IOptionsAggr } from "../paginate/aggregatePaginate";
import { IOptions } from "../paginate/paginate";
import config from "../../config/config";
import { UserStat } from "../userStat";
import { ApiError } from "../error";
import httpStatus from "http-status";
import { userService } from "../user";

export async function createTheme(
  name: string,
  image: Express.Multer.File,
): Promise<IThemeDoc> {
  return Theme.create({
    name,
    image: image.filename,
  });
}

export async function queryThemes(
  filter: Record<string, any>,
  options: IOptions,
): Promise<QueryResult> {
  const themes = await Theme.paginate(filter, options);
  return themes;
}

export async function getThemesProgressByUserId(
  id: mongoose.Types.ObjectId,
  options: IOptionsAggr,
) {
  const user = await userService.getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const pipeline = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $addFields: {
        word_progress: {
          $objectToArray: "$word_progress",
        },
      },
    },
    {
      $unwind: {
        path: "$word_progress",
      },
    },
    {
      $match: {
        "word_progress.v": {
          $gte: config.maxPoints,
        },
      },
    },
    {
      $addFields: {
        "word_progress.k": {
          $toObjectId: "$word_progress.k",
        },
      },
    },
    {
      $lookup: {
        from: "words",
        localField: "word_progress.k",
        foreignField: "_id",
        as: "word_progress.k",
      },
    },
    {
      $unwind: {
        path: "$word_progress.k",
      },
    },
    {
      $group: {
        _id: "$word_progress.k.theme",
        learnt: {
          $count: {},
        },
      },
    },
    {
      $unionWith: {
        coll: "themes",
        pipeline: [],
      },
    },
    {
      $group: {
        _id: "$_id",
        doc: {
          $first: "$$ROOT",
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$doc",
      },
    },
    {
      $lookup: {
        from: "words",
        let: {
          theme: "$_id",
          wordCount: "$count",
        },
        as: "words",
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$theme", "$theme"],
              },
            },
          },
          {
            $group: {
              _id: null,
              overall: {
                $count: {},
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$words",
      },
    },
    {
      $addFields: {
        result: {
          $round: [
            {
              $multiply: [
                {
                  $divide: [
                    "$learnt",
                    "$words.overall",
                  ],
                },
                100,
              ],
            },
            2,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "themes",
        localField: "_id",
        foreignField: "_id",
        as: "theme",
      },
    },
    {
      $unwind: {
        path: "$theme",
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        learnt: {
          $ifNull: ["$learnt", null],
        },
        outof: "$words.overall",
        result: 1,
        name: "$theme.name",
        image: "$theme.image",
      },
    },
  ];

  const result = await UserStat.aggregatePaginate(pipeline, options);

  return result;
}
