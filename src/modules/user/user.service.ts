import httpStatus from "http-status";
import { ApiError } from "../error";
import {
  IUserDoc,
  NewCreatedUser,
  NewRegisteredUser,
  UpdateUserBody,
} from "./user.interfaces";
import User from "./user.model";
import { IOptions } from "../paginate/paginate";
import { QueryResult } from "../paginate/paginate.interfaces";
import mongoose from "mongoose";
import { userStatService } from "../userStat";

export async function createUser(userBody: NewCreatedUser): Promise<IUserDoc> {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);

  if (userBody.role == "user") {
    userStatService.createUserStat({
      user: new mongoose.Types.ObjectId(user.id),
      word_progress: new Map(),
      selected: {
        themes: [],
        daily_words_count: 0,
      },
    });
  }

  return user;
}

export async function registerUser(
  userBody: NewRegisteredUser,
): Promise<IUserDoc> {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const user = await User.create(userBody);

  userStatService.createUserStat({
    user: new mongoose.Types.ObjectId(user.id),
    word_progress: new Map(),
    selected: {
      themes: [],
      daily_words_count: 0,
    },
  });

  return user;
}

export async function queryUsers(
  filter: Record<string, any>,
  option: IOptions,
): Promise<QueryResult> {
  const users = await User.paginate(filter, option);
  return users;
}

export async function getUserById(
  id: mongoose.Types.ObjectId,
): Promise<IUserDoc | null> {
  return User.findById(id);
}

export async function getUserByEmail(email: string): Promise<IUserDoc | null> {
  return User.findOne({ email });
}

export async function updateUserById(
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody,
): Promise<IUserDoc | null> {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
}

export async function deleteUserById(
  userId: mongoose.Types.ObjectId,
): Promise<IUserDoc | null> {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await user.deleteOne();
  return user;
}
