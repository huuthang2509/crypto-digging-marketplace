import { ExtractJwt, Strategy } from "passport-jwt";
import { Users } from "shared";
import { tokenTypes } from "../service";

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET || "complexsecrethere",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.Access) {
      throw new Error("Invalid token type");
    }
    const user = await Users.findByPk(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
