import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  Boxes,
  BoxesTypes,
  ErrorKey,
  filterPagination,
  findOrFail,
  Heros,
  HerosBases,
  IRequest,
  logUserHistory,
  Marketplace,
  MarketRefType,
  MetadataFields,
  parsePaginationParams,
  responseError,
  SaleStatus,
  skipValueObject,
  StatusCode,
  UserLogAction,
  Users,
} from "shared";
import { LPS_PER_SOL, transferSplToken } from "../../init-contracts";
import { verifyOrFailSignatureToken } from "../../service";
import { MarketFilerSort } from "./schema";

export async function handleGetMarketplace(req: Request, res: Response) {
  try {
    const { type, sort, quality, search, priceFrom, priceTo } = req.query;

    const { data, pagination } = await filterPagination(
      Marketplace as any,
      {
        where: skipValueObject({
          refType: type ?? undefined,
          ...((quality as string)?.split(",").length
            ? type === MarketRefType.Box
              ? { "itemCapture.boxInfo.boxType": { [Op.in]: (quality as string).split(",") } }
              : { "itemCapture.quality": { [Op.in]: (quality as string).split(",") } }
            : null),
          ...(search
            ? type === MarketRefType.Box
              ? {
                  "itemCapture.boxInfo.name": {
                    [Op.iLike]: `%${search}%`,
                  },
                }
              : {
                  "itemCapture.name": {
                    [Op.iLike]: `%${search}%`,
                  },
                }
            : null),
          ...(priceFrom ? { CDGPrice: { [Op.gte]: priceFrom } } : null),
          ...(priceTo ? { CDGPrice: { [Op.lte]: priceTo } } : null),
          status: StatusCode.Active,
          saleStatus: SaleStatus.OnMarket,
        }),
        order: [JSON.parse((sort as unknown as string) ?? MarketFilerSort.Latest)],
      },
      parsePaginationParams(req.query),
    );

    return res.json({
      data,
      pagination,
    });
  } catch (error) {
    return responseError(req as IRequest, res, error);
  }
}

export async function handleGetOneMarketplace(req: Request, res: Response) {
  try {
    const { itemId } = req.params;

    const item = await findOrFail(Marketplace as any, {
      where: {
        id: itemId,
        status: StatusCode.Active,
        saleStatus: SaleStatus.OnMarket,
      },
    });

    return res.json({
      data: item,
    });
  } catch (error) {
    return responseError(req as IRequest, res, error);
  }
}

export async function handleSendItemToMarketplace(req: IRequest, res: Response) {
  try {
    const { refId, refType, CDGPrice, sign } = req.body;
    const { id, walletAddress } = req.currentUser;

    // Validate signature
    await verifyOrFailSignatureToken(sign.signature, sign.action, walletAddress);

    // Validate items
    const model = refType === MarketRefType.Hero ? Heros : Boxes;
    const item = await findOrFail(model as any, {
      where: {
        id: refId,
        status: StatusCode.Active,
        ownerId: id,
        readyToUse: true,
      },
      include:
        model === Heros
          ? [
              {
                model: HerosBases,
                as: "baseInfo",
                attributes: {
                  exclude: ["type", "data", ...MetadataFields],
                },
              },
              {
                model: Users,
                as: "owner",
                attributes: ["id", "walletAddress"],
              },
            ]
          : [
              {
                model: BoxesTypes,
                as: "boxInfo",
                attributes: {
                  exclude: [...MetadataFields],
                },
              },
              {
                model: Users,
                as: "owner",
                attributes: ["id", "walletAddress"],
              },
            ],
    });

    // Push item on market
    const transaction = await Marketplace.sequelize.transaction();
    let itemMarket = null;

    try {
      // Put item from the market
      itemMarket = await Marketplace.create(
        {
          ownerId: id,
          CDGPrice,
          createdBy: id,
          refId,
          refType,
          itemCapture: item,
        },
        { transaction },
      );

      // Update related
      await item.update(
        {
          readyToUse: false,
        },
        { transaction },
      );

      // Log user history
      await logUserHistory({ id } as Users, {
        logType: model === Heros ? MarketRefType.Hero : MarketRefType.Box,
        action: UserLogAction.SaleUp,
        data: itemMarket,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      // Back owner to purchaser
      await transferSplToken(walletAddress, (item as Heros | Boxes).tokenId);
      throw ErrorKey.UnknownError;
    }

    return res.json({ data: itemMarket });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function handleRemoveItemFromMarketplace(req: IRequest, res: Response) {
  try {
    const { refId, refType, sign } = req.body;
    const { id, walletAddress } = req.currentUser;

    // Validate signature
    await verifyOrFailSignatureToken(sign.signature, sign.action, walletAddress);
    // Push item on market
    const transaction = await Marketplace.sequelize.transaction();

    try {
      // Remove item from the market
      const itemMarket = await Marketplace.findOne({
        where: {
          ownerId: id,
          createdBy: id,
          refId,
          refType,
          saleStatus: SaleStatus.OnMarket,
        },
        transaction,
      });

      // Validate items
      const model = refType === MarketRefType.Hero ? Heros : Boxes;
      const item = await findOrFail(model as any, {
        where: {
          id: refId,
          status: StatusCode.Active,
          ownerId: id,
          readyToUse: false,
        },
        transaction,
      });

      // Update related
      await item.update(
        {
          readyToUse: true,
        },
        { transaction },
      );

      await itemMarket.update(
        {
          status: StatusCode.Deleted,
        },
        { transaction },
      );

      // Back owner to purchaser
      await transferSplToken(walletAddress, (item as Heros | Boxes).tokenId);

      // Log user history
      await logUserHistory({ id } as Users, {
        logType: model === Heros ? MarketRefType.Hero : MarketRefType.Box,
        action: UserLogAction.SaleDown,
        data: itemMarket,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw ErrorKey.UnknownError;
    }

    return res.json({
      data: {
        msg: "Remove item from the market successfully",
      },
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function handlePurchaseItemFromMarketplace(req: IRequest, res: Response) {
  try {
    const { refId, refType, sign } = req.body;
    const { id, walletAddress } = req.currentUser;

    // Validate signature
    await verifyOrFailSignatureToken(sign.signature, sign.action, walletAddress);
    // Push item on market
    const transaction = await Marketplace.sequelize.transaction();

    try {
      // Remove item to market
      const itemMarket: Marketplace = await findOrFail(Marketplace as any, {
        where: {
          refId,
          refType,
          saleStatus: SaleStatus.OnMarket,
        },
        include: [
          {
            model: Users,
            as: "owner",
            attributes: ["walletAddress"],
          },
        ],
        transaction,
      });

      // Purchase owner item
      if (itemMarket.ownerId === id) {
        throw ErrorKey.MarketplaceBuyOwnerItem;
      }

      // Validate items
      const model = refType === MarketRefType.Hero ? Heros : Boxes;
      const item = await findOrFail(model as any, {
        where: {
          id: refId,
          status: StatusCode.Active,
          ownerId: itemMarket.ownerId,
          readyToUse: false,
        },
        transaction,
      });

      // Update related
      await item.update(
        {
          ownerId: id,
          readyToUse: true,
        },
        { transaction },
      );

      await itemMarket.update(
        {
          status: StatusCode.Deleted,
        },
        { transaction },
      );

      // Back owner to purchaser
      await transferSplToken(walletAddress, (item as Heros | Boxes).tokenId);

      // Send CDG to seller
      await transferSplToken(
        itemMarket.owner.walletAddress,
        process.env.CDG_TOKEN_ID || "7ctmggF48CzBq6L6JvmcM5KrjfRm4zMir1ycVoFfkd31",
        itemMarket.CDGPrice / LPS_PER_SOL,
      );

      // Log user history
      await logUserHistory({ id } as Users, {
        logType: model === Heros ? MarketRefType.Hero : MarketRefType.Box,
        action: UserLogAction.Purchase,
        data: itemMarket,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw ErrorKey.UnknownError;
    }

    return res.json({
      data: {
        msg: "Purchase item from the market successfully",
      },
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}
