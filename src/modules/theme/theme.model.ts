import { model, Schema } from "mongoose";
import { IThemeDoc, IThemeModel } from "./theme.interfaces";
import { toJSON } from "../toJSON";
import { aggregatePaginate, paginate } from "../paginate";

const themeSchema = new Schema<IThemeDoc, IThemeModel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

themeSchema.plugin(toJSON);
themeSchema.plugin(paginate);
themeSchema.plugin(aggregatePaginate);

themeSchema.pre("deleteOne", async function (next) {
  /* delete image */
  next();
});

const Theme = model<IThemeDoc, IThemeModel>("Theme", themeSchema);

export default Theme;
