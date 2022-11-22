import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { Op } from "sequelize";
import { ErrorKey, Heros, IRequest, responseError, StatusCode, Users } from "shared";
import { generateAuthTokens } from "../../service";
import { verifyMessage } from "./business";

// Web
export async function handlePostAuthSignIn(req: Request, res: Response) {
  try {
    const { nonce, signature, walletAddress } = req.body;

    // Verify signature
    const verified = await verifyMessage(signature, nonce, walletAddress);
    if (!verified) {
      throw ErrorKey.InvalidAccountInfo;
    }

    const [user] = await Users.findOrCreate({
      where: { walletAddress },
    });

    // Return token sign-in
    return res.json({
      ...(await generateAuthTokens(user)),
      isNeedRegister: !(user.username && user.password),
    });
  } catch (error) {
    return responseError(req as IRequest, res, error);
  }
}

export async function handlePostSignUp(req: IRequest, res: Response) {
  try {
    const { id } = req.currentUser;
    const { username, password } = req.body;

    // User with username
    const user = await Users.findOne({
      where: {
        username,
        status: StatusCode.Active,
      },
    });
    if (user) {
      throw ErrorKey.UsernameExisted;
    }

    // Update username password
    await Users.update(
      {
        username,
        password: await bcrypt.hash(password, 10),
      },
      {
        where: {
          id,
          walletAddress: {
            [Op.ne]: null,
          },
        },
      },
    );

    // Return
    return res.json({ msg: "Update info successfully" });
  } catch (error) {
    return responseError(req, res, error);
  }
}

// App
export async function handlePostAppSignIn(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // Verify signature
    const user = await Users.findOne({
      where: {
        username,
        walletAddress: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Heros,
          required: false,
          as: "heros",
          where: {
            status: StatusCode.Active,
          },
        },
      ],
    });
    if (!user || (await bcrypt.compare(user.password, password))) {
      throw ErrorKey.RecordNotFound;
    } else {
      if (!user.heros?.length) {
        throw ErrorKey.HeroNotEnoughToPlay;
      }
    }

    // Return token sign-in
    return res.json({ isSuccess: true, ...(await generateAuthTokens(user)) });
  } catch (error) {
    return responseError(req as IRequest, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}
