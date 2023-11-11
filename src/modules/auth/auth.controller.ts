import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { tokenService } from "../token";
import * as authService from "./auth.service";
import { userService } from "../user";
import config from "../../config/config";
import { ApiError } from "../error";

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.genAuthTokens(user);

  res.cookie("jwt", tokens.refresh.token, {
    httpOnly: config.jwt.cookieOptions.httpOnly,
    maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
  });

  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.genAuthTokens(user);

  res.cookie("jwt", tokens.refresh.token, {
    httpOnly: config.jwt.cookieOptions.httpOnly,
    maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
  });

  res.send({ user, tokens });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    res.status(httpStatus.NO_CONTENT).send();
    return;
  }
  await authService.logout(refreshToken);
  
  res.clearCookie("jwt");

  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "JWT is undefined");
  }
  const userWithTokens = await authService.refreshAuth(refreshToken);

  res.cookie("jwt", userWithTokens.tokens.refresh.token, {
    httpOnly: config.jwt.cookieOptions.httpOnly,
    maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
  });

  res.send({ ...userWithTokens });
});
