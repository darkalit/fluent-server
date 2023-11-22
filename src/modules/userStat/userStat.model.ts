import { model, Schema } from "mongoose";
import { IUserStatDoc, IUserStatModel } from "./userStat.interfaces";
import { toJSON } from "../toJSON";
import { aggregatePaginate, paginate } from "../paginate";

const userStatSchema = new Schema<IUserStatDoc, IUserStatModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
    unique: true,
  },
  // word_progress: [{
  //   word: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Word",
  //     required: true,
  //   },
  //   progress: {
  //     type: Number,
  //     default: -1,
  //   },
  // }],
  word_progress: {
    type: Schema.Types.Map,
    of: Number,
  },
  selected: {
    themes: {
      type: [Schema.Types.ObjectId],
      ref: "Theme",
      required: true,
    },
    daily_words_count: {
      type: Number,
      required: true,
    },
  },
}, {
  timestamps: true,
});

userStatSchema.plugin(toJSON);
userStatSchema.plugin(paginate);
userStatSchema.plugin(aggregatePaginate);

const UserStat = model<IUserStatDoc, IUserStatModel>(
  "UserStat",
  userStatSchema,
);

export default UserStat;
