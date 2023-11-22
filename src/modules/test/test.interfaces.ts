import { Document, Model, Types } from "mongoose";
import { IWordDoc } from "../word/word.interfaces";

export interface IChooseTest {
  test: Types.ObjectId;
  correct: number;
  variants: IWordDoc[];
}

export interface IEnterTest {
  test: Types.ObjectId;
  correct: string;
  variant: IWordDoc;
}

export enum ETestType {
  Choose = "choose",
  Enter = "enter",
}

export interface ITest {
  user: Types.ObjectId;
  word: Types.ObjectId;
  type: ETestType;
  correct: number | string;
}

export interface ITestDoc extends ITest, Document {}
export interface ITestModel extends Model<ITestDoc> {}

export interface IAnswer {
  test: Types.ObjectId;
  user: Types.ObjectId;
  correct: number | string;
}
