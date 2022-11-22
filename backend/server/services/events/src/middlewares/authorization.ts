/* eslint-disable @typescript-eslint/no-unsafe-return */
import { NextFunction, Response } from "express";
import passport from "passport";
import { ErrorKey, IRequest, responseError } from "shared";

const verifyCallback = (req, res, resolve) => (err, user, info) => {
  if (err || info || !user) {
    return responseError(req, res, ErrorKey.AuthFailed);
  }
  if (req.route.path !== "/sign-up" && (!user.username || !user.password)) {
    return responseError(req, res, ErrorKey.RequireUpdateUsernamePassword);
  }
  req.currentUser = user;

  resolve();
};

export const auth = async (req: IRequest, res: Response, next: NextFunction) => {
  return new Promise((resolve, _) => {
    passport.authenticate("jwt", { session: false }, verifyCallback(req, res, resolve))(req, res, next);
  })
    .then(next)
    .catch((err) => next(err));
};
