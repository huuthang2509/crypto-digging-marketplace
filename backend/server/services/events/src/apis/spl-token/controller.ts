import { Request, Response } from "express";
import { IRequest, responseError } from "shared";
import { createSplToken, fromWallet, transferSolFromMasterWallet, transferSplToken } from "../../init-contracts";
import { verifyOrFailSignatureToken } from "../../service";

export async function handleCreateSplToken(req: Request, res: Response) {
  try {
    const address = await createSplToken(fromWallet.publicKey.toBase58());
    return res.json({ address });
  } catch (error) {
    return responseError(req as IRequest, res, error);
  }
}

export async function handleTransferAuthority(req: IRequest, res: Response) {
  try {
    const walletAddress = "FraFwpndBsFJ6b7pKpVVXMyuMcBJvuGg8QccL2k66jtZ";
    const address = await transferSplToken(walletAddress, req.body.splToken);
    return res.json({ address });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function handleTransferCDG(req: IRequest, res: Response) {
  try {
    const { walletAddress } = req.currentUser;
    const { amount, sign } = req.body;

    // Verify signature
    await verifyOrFailSignatureToken(sign.signature, sign.action, walletAddress);

    const address = await transferSplToken(
      walletAddress,
      process.env.CDG_TOKEN_ID || "7ctmggF48CzBq6L6JvmcM5KrjfRm4zMir1ycVoFfkd31",
      amount,
    );
    return res.json({ address });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function withdrawSolMoney(req: IRequest, res: Response) {
  try {
    const { walletAddress } = req.currentUser;
    const { amount, sign } = req.body;

    // Verify signature
    await verifyOrFailSignatureToken(sign.signature, sign.action, walletAddress);

    const address = await transferSolFromMasterWallet(walletAddress, amount);
    return res.json({ address });
  } catch (error) {
    return responseError(req, res, error);
  }
}
