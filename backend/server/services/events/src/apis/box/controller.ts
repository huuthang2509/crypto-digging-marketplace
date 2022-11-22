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
  logNewNftItem,
  logUserHistory,
  MarketRefType,
  parsePaginationParams,
  responseError,
  StatusCode,
  UserLogAction,
  Users,
} from "shared";
import { createSplToken } from "../../init-contracts";
import { verifyOrFailSignatureToken } from "../../service";
import { createBulkBoxNft } from "./business";
import { InventoryFilterState } from "./schema";
import { serializeBoxResponse } from "./serialize";
import { getRandomHeroTypeV2, getRandomNumberInRange } from "./util";

export async function handleGetBoxes(req: Request, res: Response) {
  try {
    const { data, pagination } = await filterPagination(
      BoxesTypes as any,
      {
        where: {
          status: StatusCode.Active,
        },
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

export async function handleGetInventoryBoxes(req: IRequest, res: Response) {
  const { state, search, quality } = req.query;

  try {
    const { data, pagination } = await filterPagination(
      Boxes as any,
      {
        where: {
          ...(state ? { readyToUse: state === InventoryFilterState.Ready } : null),
          ...((quality as string)?.split(",").length
            ? { "boxInfoCapture.boxType": { [Op.in]: (quality as string).split(",") } }
            : null),
          ...(search ? { "boxInfoCapture.name": { [Op.iLike]: `%${search}%` } } : null),
          status: StatusCode.Active,
          ownerId: req.currentUser.id,
          isOpened: false,
        },
        order: [["createdAt", "DESC"]],
      },
      parsePaginationParams(req.query),
    );

    return res.json({
      data: await serializeBoxResponse(data as Boxes[]),
      pagination,
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function handlePostPurchaseBoxes(req: IRequest, res: Response) {
  try {
    const { walletAddress } = req.currentUser;
    const { boxInfoId, sign } = req.body;

    // Validate transaction -> need to discus
    await verifyOrFailSignatureToken(sign.signature, sign.action, walletAddress);

    // Box infos
    const boxInfo: BoxesTypes = await findOrFail(BoxesTypes as any, {
      where: {
        id: boxInfoId,
      },
    });

    // Create items
    createBulkBoxNft(req.body, req.currentUser, boxInfo);

    return res.json({ msg: "Buy box successfully" });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function handlePostOpenBox(req: IRequest, res: Response) {
  try {
    const { id, walletAddress } = req.currentUser;
    const { boxId, sign } = req.body;

    // Verify signature
    await verifyOrFailSignatureToken(sign.signature, sign.action, walletAddress);

    // Validate box
    const box: Boxes = await findOrFail(Boxes as any, {
      where: {
        status: StatusCode.Active,
        readyToUse: true,
        isOpened: false,
        ownerId: id,
        id: boxId,
      },
      include: [
        {
          model: BoxesTypes,
          as: "boxInfo",
        },
      ],
    });

    // Random hero type
    const heroType = await getRandomHeroTypeV2(box);
    const { data, animationSpeedRange, moveSpeedRange, gemEarnRange, staminaRange }: HerosBases = await findOrFail(
      HerosBases as any,
      {
        where: {
          type: heroType,
        },
      },
    );

    // Handle logic
    const transaction = await Heros.sequelize.transaction();
    let hero = null;

    try {
      // Create hero
      const [animationSpeed, moveSpeed, gemEarn, stamina] = [
        getRandomNumberInRange(animationSpeedRange[0], animationSpeedRange[1]),
        getRandomNumberInRange(moveSpeedRange[0], moveSpeedRange[1]),
        getRandomNumberInRange(gemEarnRange[0], animationSpeedRange[1]),
        getRandomNumberInRange(staminaRange[0], staminaRange[1]),
      ];
      hero = await Heros.create(
        {
          ...data[getRandomNumberInRange(0, data.length - 1)],
          quality: heroType,
          tokenId: await createSplToken(walletAddress),
          ownerId: id,
          statistic: {
            animationSpeed,
            moveSpeed,
            gemEarn,
            stamina,
          },
          currentStamina: stamina,
        },
        {
          transaction,
        },
      );

      // Update related record
      await box.update(
        {
          isOpened: true,
          readyToUse: false,
          heroId: hero.id,
        },
        { transaction },
      );

      // Logs nft
      await logNewNftItem({
        refId: hero.id,
        refType: MarketRefType.Hero,
        quality: heroType,
        tokenId: hero.tokenId,
        ownerId: id,
      });

      // Log user history
      await logUserHistory({ id } as Users, { logType: MarketRefType.Box, action: UserLogAction.OpenBox, data: box });
      await logUserHistory({ id } as Users, { logType: MarketRefType.Hero, action: UserLogAction.OpenBox, data: hero });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw ErrorKey.UnknownError;
    }

    return res.json({ data: hero });
  } catch (error) {
    return responseError(req, res, error);
  }
}
