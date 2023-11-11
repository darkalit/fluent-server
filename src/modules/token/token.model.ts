import { model, Schema } from "mongoose";
import tokenTypes from "./token.types";
import { ITokenDoc, ITokenModel } from "./token.interfaces";
import { toJSON } from "../toJSON";

const tokenSchema = new Schema<ITokenDoc, ITokenModel>({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [tokenTypes.REFRESH],
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

tokenSchema.plugin(toJSON);

const Token = model<ITokenDoc, ITokenModel>("Token", tokenSchema);

export default Token;
