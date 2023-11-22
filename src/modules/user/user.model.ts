import { model, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { IUserDoc, IUserModel } from "./user.interfaces";
import { roles } from "../../config/roles";
import { authTypes, authTypesList } from "../../config/authTypes";
import { toJSON } from "../toJSON";
import { paginate } from "../paginate";

const userSchema = new Schema<IUserDoc, IUserModel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    private: true,
  },
  auth_type: {
    type: String,
    enum: authTypesList,
    default: authTypes.standalone,
  },
  role: {
    type: String,
    enum: roles,
    default: "user",
  },
}, {
  timestamps: true,
});

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.static(
  "isEmailTaken",
  async function (
    email: string,
    excludeUserId: Types.ObjectId,
  ): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  },
);

userSchema.method(
  "isPasswordMatch",
  async function (password: string): Promise<boolean> {
    const user = this;
    return bcrypt.compare(password, user.password);
  },
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model<IUserDoc, IUserModel>("User", userSchema);

export default User;
