import { Request, Response } from "express";
import { ErrorKey, IRequest, responseError, Users } from "shared";
import { getAccountBalance, ratioExchangeGem, transferSplToken } from "../../init-contracts";
import { verifyOrFailSignatureToken } from "../../service";

export async function handleGetBalance(req: Request, res: Response) {
  try {
    const balance = await getAccountBalance(req.query.address as string);
    return res.json({ balance });
  } catch (error) {
    return responseError(req as IRequest, res, error);
  }
}

export async function handleGetGameBalance(req: IRequest, res: Response) {
  try {
    const { walletAddress } = req.currentUser;

    const { CDG } = await Users.findOne({
      where: {
        walletAddress,
      },
    });
    res.json({
      balance: Number(CDG),
      unit: "Gem",
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function handleTransferGemToCDG(req: IRequest, res: Response) {
  try {
    const { walletAddress } = req.currentUser;
    const { amount, sign } = req.body;

    // Verify signature
    await verifyOrFailSignatureToken(sign.signature, sign.action, walletAddress);

    const user = await Users.findOne({
      where: {
        walletAddress,
      },
    });

    if (user.CDG < amount) {
      throw ErrorKey.WithdrawFail;
    }
    await user.update({
      CDG: Number(user.CDG) - amount,
    });

    const signature = await transferSplToken(
      walletAddress,
      process.env.CDG_TOKEN_ID || "7ctmggF48CzBq6L6JvmcM5KrjfRm4zMir1ycVoFfkd31",
      amount * ratioExchangeGem,
    );

    if (!signature) {
      throw ErrorKey.UnknownError;
    }

    return res.json({
      signature,
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}
