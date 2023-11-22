import { Document, Model, PipelineStage, Types } from "mongoose";
import { QueryResult } from "../paginate/paginate.interfaces";
import NestedPartial from "../utils/NestedPartial";

// export interface IWordProgress {
//   word: Types.ObjectId;
//   progress: number;
// }

export interface ISelected {
  themes: Types.ObjectId[];
  daily_words_count: number;
}

export interface IUserStat {
  user: Types.ObjectId;
  // word_progress: IWordProgress[];
  word_progress: Map<Types.ObjectId, number>,
  selected: ISelected;
}

export interface IUserStatDoc extends IUserStat, Document {}

export interface IUserStatModel extends Model<IUserStatDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>,
  ): Promise<QueryResult>;
  aggregatePaginate(
    query: PipelineStage[],
    options: Record<string, any>,
  ): Promise<QueryResult>;
}

export type NewCreatedUserStat = IUserStat;
export type UpdateUserStatBody = NestedPartial<Omit<IUserStat, "user">>;
