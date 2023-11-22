import { Document, Model, Types } from "mongoose";
import { QueryResult } from "../paginate/paginate.interfaces";
import { IAuthTokens } from "../token/token.interfaces";

export interface IUser {
  name: string;
  email: string;
  password: string;
  auth_type: string;
  role: string;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean>;
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>,
  ): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;
export type NewRegisteredUser = Omit<IUser, "role" | "auth_type">;
export type NewCreatedUser = Omit<IUser, "auth_type">;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: IAuthTokens;
}
