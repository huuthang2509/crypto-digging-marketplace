import { Response } from "express";
import moment from "moment";
import { Op } from "sequelize";
import { findOrFail, generateRandomString, IRequest, responseError, StatusCode, UserActions } from "shared";
import { getSignatureByNonce, verifyActionSignature } from "../../init-contracts";

export async function generateSignature(req: IRequest, res: Response): Promise<Response> {
  try {
    const { walletAddress } = req.currentUser;
    const { action } = req.body;

    const nonce = generateRandomString();
    const signature = getSignatureByNonce(nonce);

    const data = {
      walletAddress,
      action,
      signature,
      nonce,
      status: StatusCode.Active,
    };

    const [newAction, isCreated] = await UserActions.findOrCreate({
      where: data,
      defaults: {
        expiredAt: moment().add(process.env.SIGNATURE_EXPIRED, "minutes").toDate(),
      },
    });

    return res.json({
      signature: newAction.signature,
      isCreated,
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function verifySignature(req: IRequest, res: Response) {
  try {
    const { signature, action } = req.body;
    const { walletAddress } = req.currentUser;

    const userAction: UserActions = await findOrFail(UserActions as any, {
      where: {
        signature,
        walletAddress,
        action,
        status: StatusCode.Active,
        expiredAt: {
          [Op.gte]: moment(),
        },
      },
    });

    const permission = verifyActionSignature(signature, userAction.nonce);

    // Delete record
    await userAction.update({
      status: StatusCode.Deleted,
    });

    res.json({
      permission,
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}
