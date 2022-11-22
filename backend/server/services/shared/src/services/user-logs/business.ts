import {
  HeroBoxesType,
  MarketRefType,
  NftDefineQuantities,
  NftMintLogs,
  UserLogAction,
  Users,
  UsersLogs,
} from "../../models";

export interface INftMintLog {
  refId: string;
  refType: MarketRefType;
  quality: HeroBoxesType;
  tokenId: string;
  ownerId: string;
}

export async function logNewNftItem(item: INftMintLog) {
  await NftMintLogs.create(item);
  const nftConfig = await NftDefineQuantities.findOne({
    where: {
      refType: item.refType,
      quality: item.quality,
    },
  });
  if (nftConfig) {
    await nftConfig.update({
      totalMint: await NftMintLogs.count({
        where: {
          refType: item.refType,
          quality: item.quality,
        },
      }),
    });
  }
}

export interface IUserRecordLog {
  logType: MarketRefType;
  action: UserLogAction;
  data: object;
}

export async function logUserHistory(currentUser: Users, recordLog: IUserRecordLog) {
  return UsersLogs.create({ ...recordLog, createdBy: currentUser.id, userId: currentUser.id });
}
