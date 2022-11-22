import { Response } from "express";
import { IRequest, responseError, unit_price } from "shared";
import { getAccountBalance } from "../../init-contracts";

// Infos
export async function getUserBalance(req: IRequest, res: Response): Promise<void> {
  try {
    const { walletAddress } = req.currentUser;
    // const connection = getSolWeb3Connection();
    const balance = await getAccountBalance(walletAddress as string);
    res.json({
      balance,
      unit: unit_price,
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}
