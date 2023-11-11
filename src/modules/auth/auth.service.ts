import { IUserDoc, IUserWithTokens } from "../user/user.interfaces";
import { getUserByEmail, getUserById } from "../user/user.service";
import { ApiError } from "../error";
import httpStatus from "http-status";
import { Token, tokenTypes } from "../token";
import { genAuthTokens, verifyToken } from "../token/token.service";

export async function loginUserWithEmailAndPassword(
  email: string,
  password: string,
): Promise<IUserDoc> {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
}

export async function logout(refreshToken: string): Promise<void> {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.deleteOne();
}

export async function refreshAuth(
  refreshToken: string,
): Promise<IUserWithTokens> {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await genAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not authorized");
  }
}
