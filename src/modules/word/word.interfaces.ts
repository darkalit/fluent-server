import { Document, Model, PipelineStage, Types } from "mongoose";
import { QueryResult } from "../paginate/paginate.interfaces";

export interface IPhonetics {
  text: string;
  audio: string;
}

export interface IWord {
  ukr: string;
  eng: string;
  category: string;
  theme: Types.ObjectId;
  phonetics: IPhonetics;
}

export interface IWordDoc extends IWord, Document {}
export interface IWordModel extends Model<IWordDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>,
  ): Promise<QueryResult>;
  aggregatePaginate(
    query: PipelineStage[],
    options: Record<string, any>,
  ): Promise<QueryResult>;
}
