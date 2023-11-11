import { NextFunction, Request, Response } from "express";
import passport from "passport";
import httpStatus from "http-status";
import { roleRights } from "../../config/roles";
import { IUserDoc } from "../user/user.interfaces";
import ApiError from "../error/ApiError";

function verifyCallback(
  req: Request,
  resolve: any,
  reject: any,
  requiredRights: string[],
) {
  return async (err: Error, user: IUserDoc, info: string) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, "Not authorized"));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      if (!userRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
      const hasRequiredRights = requiredRights.every((requiredRight: string) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params["userId"] !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };
}

function authMiddleware(...requiredRights: string[]) {
  return async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights),
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
}

export default authMiddleware;
