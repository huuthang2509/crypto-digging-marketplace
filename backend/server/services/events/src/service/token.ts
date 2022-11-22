/* eslint-disable @typescript-eslint/require-await */
import * as jwt from "jsonwebtoken";
import moment from "moment-timezone";

export const tokenTypes = {
  Access: "access",
  Refresh: "refresh",
};

export const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET || "complexsecrethere") => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

export const verifyToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || "complexsecrethere");
};

export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRE || 1, "day");
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.Access);

  const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRE || 7, "days");
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.Refresh);

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
};
