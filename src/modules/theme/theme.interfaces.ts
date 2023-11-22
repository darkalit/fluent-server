import { Document, Model, PipelineStage } from "mongoose";
import { QueryResult } from "../paginate/paginate.interfaces";

export interface ITheme {
  name: string;
  image: string;
}

export interface IThemeDoc extends ITheme, Document {}

export interface IThemeModel extends Model<IThemeDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>,
  ): Promise<QueryResult>;
  aggregatePaginate(
    query: PipelineStage[],
    options: Record<string, any>,
  ): Promise<QueryResult>;
}

export type UpdateTheme = Partial<ITheme>;
