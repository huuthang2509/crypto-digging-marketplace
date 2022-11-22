import {
  Boxes,
  BoxesTypes,
  logNewNftItem,
  logUserHistory,
  MarketRefType,
  safeParseInt,
  UserLogAction,
  Users,
} from "shared";
import { createSplToken } from "../../init-contracts";

export async function createBulkBoxNft(
  body: { boxInfoId: string; amount: number },
  currentUser: Users,
  boxInfo: BoxesTypes,
) {
  const { id, walletAddress } = currentUser;
  const { boxInfoId, amount } = body;

  for (let i = 0; i < safeParseInt(amount); i++) {
    const transaction = await Boxes.sequelize.transaction();

    try {
      // Create item
      const box = await Boxes.create(
        {
          tokenId: await createSplToken(walletAddress),
          boxInfoId,
          boxInfoCapture: boxInfo.get(),
          ownerId: id,
          createdBy: id,
        },
        { transaction },
      );

      // Logs nft
      await logNewNftItem({
        refId: box.id,
        refType: MarketRefType.Box,
        quality: boxInfo.boxType,
        tokenId: box.tokenId,
        ownerId: id,
      });

      // Log user
      await logUserHistory({ id } as Users, {
        logType: MarketRefType.Box,
        action: UserLogAction.Purchase,
        data: box,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  }
}
