import { Schema, model } from "mongoose";
import { IWordDoc, IWordModel } from "./word.interfaces";
import { toJSON } from "../toJSON";
import { paginate } from "../paginate";

const wordSchema = new Schema<IWordDoc, IWordModel>({
  ukr: {
    type: String,
    required: true,
    trim: true,
  },
  eng: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  theme: {
    type: Schema.Types.ObjectId,
    ref: "Theme",
    required: true,
  },
  phonetics: {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    audio: {
      type: String,
      required: true,
      trim: true,
    },
  },
}, {
  timestamps: true,
});

wordSchema.plugin(toJSON);
wordSchema.plugin(paginate);

const Word = model<IWordDoc, IWordModel>("Word", wordSchema);

export default Word;
