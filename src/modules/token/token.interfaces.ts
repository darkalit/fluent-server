import { Document, Model, Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export interface IToken {
  user: Types.ObjectId;
  token: string;
  type: string;
  expires: Date;
}

export interface ITokenDoc extends IToken, Document {}

export interface ITokenModel extends Model<ITokenDoc> {}

export interface IPayload extends JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}

export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface IAuthTokens {
  access: TokenPayload;
  refresh: TokenPayload;
}
