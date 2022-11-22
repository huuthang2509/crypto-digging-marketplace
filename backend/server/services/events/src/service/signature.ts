import moment from "moment";
import { Op } from "sequelize";
import { ErrorKey, StatusCode, UserActions } from "shared";
import { verifyActionSignature } from "../init-contracts";

export const verifySignatureAction = async (
  signature: string,
  action: string,
  walletAddress: string,
): Promise<boolean> => {
  const userAction: UserActions = await UserActions.findOne({
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

  if (!userAction) return false;

  const permission = verifyActionSignature(signature, userAction.nonce);

  await userAction.update({
    status: StatusCode.Deleted,
  });

  return permission;
};

export const verifyOrFailSignatureToken = async (
  signature: string,
  action: string,
  walletAddress: string,
): Promise<boolean> => {
  try {
    const permission = await verifySignatureAction(signature, action, walletAddress);

    if (!permission) {
      return Promise.reject(ErrorKey.ActionFail);
    }

    return permission;
  } catch (error) {
    return Promise.reject(error);
  }
};
