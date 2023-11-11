import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import config from "../../config/config";
import moment, { Moment } from "moment";
import { IUserDoc } from "../user/user.interfaces";
import { ITokenDoc, IAuthTokens } from "./token.interfaces";
import Token from "./token.model";
import tokenTypes from "./token.types";
import ApiError from "../error/ApiError";
import httpStatus from "http-status";

export function generateToken(
  userId: Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret,
): string {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
}

export async function saveToken(
  token: string,
  userId: Types.ObjectId,
  expires: Moment,
  type: string,
): Promise<ITokenDoc> {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
  });

  return tokenDoc;
}

export async function verifyToken(
  token: string,
  type: string,
): Promise<ITokenDoc> {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload.sub != "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "bad user");
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
}

export async function genAuthTokens(user: IUserDoc): Promise<IAuthTokens> {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes",
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS,
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days",
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
}
