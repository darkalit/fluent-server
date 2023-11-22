import { model, Schema } from "mongoose";
import { ETestType, ITestDoc, ITestModel } from "./test.interfaces";

const testModel = new Schema<ITestDoc, ITestModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  word: {
    type: Schema.Types.ObjectId,
    ref: "Word",
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(ETestType),
    required: true,
  },
  correct: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const Test = model<ITestDoc, ITestModel>("Test", testModel);

export default Test;
