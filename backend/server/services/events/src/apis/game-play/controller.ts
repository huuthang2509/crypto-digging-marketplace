import { Response } from "express";
import { Op } from "sequelize";
import {
  Boxes,
  BoxesTypes,
  EarnFrom,
  findOrFail,
  GamePlays,
  GameStatus,
  Heros,
  HerosBases,
  HeroStatus,
  IRequest,
  logNewNftItem,
  logUserHistory,
  MarketRefType,
  responseError,
  StatusCode,
  UserLogAction,
  Users
} from "shared";
import { createSplToken } from "../../init-contracts";
import { getRandomNumberInRange } from "../box/util";

export async function handleAppCreateGamePlay(req: IRequest, res: Response) {
  const { id } = req.currentUser;

  try {
    return res.json({
      isSuccess: true,
      data: await GamePlays.create({
        createdBy: id,
      }),
    });
  } catch (error) {
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}

export async function handleAppGetGamePlay(req: IRequest, res: Response) {
  const { id } = req.params;

  try {
    return res.json({
      isSuccess: true,
      data: await findOrFail(GamePlays as any, { where: { id } }),
    });
  } catch (error) {
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}

export async function handleAppGetGamePlayLatest(req: IRequest, res: Response) {
  const { id } = req.currentUser;

  try {
    return res.json({
      isSuccess: true,
      data: await findOrFail(GamePlays as any, { where: { createdBy: id }, order: [["createdAt", "DESC"]] }),
    });
  } catch (error) {
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}

export async function handleAppUpdateGamePlay(req: IRequest, res: Response) {
  const { id, profitLevel, speedLevel, workerLevel, gameStatus, log, CDGBonus, heroSpawned } = req.body;

  const trans = await GamePlays.sequelize.transaction();

  try {
    const game: GamePlays = await findOrFail(GamePlays as any, {
      where: {
        id,
        createdBy: req.currentUser.id,
        status: StatusCode.Active,
        gameStatus: {
          [Op.ne]: GameStatus.Ended,
        } as any,
      },
      transaction: trans,
    });

    const logs = game.logs;
    if (log && Object.keys(log).length) {
      logs.push(log);
      game.changed("logs", true);
    }
    const heroSpawneds = game.heroSpawneds;
    if (heroSpawned && !heroSpawneds.includes(heroSpawned)) {
      heroSpawneds.push(heroSpawned);
      game.changed("heroSpawneds", true);
    }

    await game.update(
      {
        profitLevel,
        speedLevel,
        workerLevel,
        gameStatus,
        logs,
        heroSpawneds,
      },
      { transaction: trans },
    );

    if (CDGBonus && gameStatus === GameStatus.Ended) {
      const user = await Users.findByPk(req.currentUser.id);
      await user.update({ CDG: +user.CDG + +CDGBonus });
    }

    await trans.commit();

    return res.json({ isSuccess: true, data: game });
  } catch (error) {
    await trans.rollback();
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}

export async function handleAppEarnItem(req: IRequest, res: Response) {
  const { id, walletAddress } = req.currentUser;
  const { type, quality } = req.body;

  const model = type === MarketRefType.Hero ? Heros : Boxes;
  const transaction = await model.sequelize.transaction();

  let item = null;

  try {
    // Create spl token
    if (model === Heros) {
      const { data, animationSpeedRange, moveSpeedRange, gemEarnRange, staminaRange }: HerosBases = await findOrFail(
        HerosBases as any,
        {
          where: {
            type: quality,
          },
        },
      );
      const [animationSpeed, moveSpeed, gemEarn, stamina] = [
        getRandomNumberInRange(animationSpeedRange[0], animationSpeedRange[1]),
        getRandomNumberInRange(moveSpeedRange[0], moveSpeedRange[1]),
        getRandomNumberInRange(gemEarnRange[0], animationSpeedRange[1]),
        getRandomNumberInRange(staminaRange[0], staminaRange[1]),
      ];

      item = await Heros.create(
        {
          ...data[getRandomNumberInRange(0, data.length - 1)],
          quality,
          tokenId: await createSplToken(walletAddress),
          ownerId: id,
          earnFrom: EarnFrom.Lucky,
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
    } else if (model === Boxes) {
      const boxInfo: BoxesTypes = await findOrFail(BoxesTypes as any, {
        where: {
          boxType: quality,
        },
      });
      item = await Boxes.create(
        {
          tokenId: await createSplToken(walletAddress),
          boxInfoId: boxInfo.id,
          boxInfoCapture: boxInfo.get(),
          ownerId: id,
          createdBy: id,
          earnFrom: EarnFrom.Lucky,
        },
        { transaction },
      );
    }

    // Logs nft
    await logNewNftItem({
      refId: item.id,
      refType: model === Heros ? MarketRefType.Hero : MarketRefType.Box,
      quality,
      tokenId: item.tokenId,
      ownerId: id,
    });

    // Log user history
    await logUserHistory({ id } as Users, {
      logType: model === Heros ? MarketRefType.Hero : MarketRefType.Box,
      action: UserLogAction.Claim,
      data: item,
    });

    await transaction.commit();

    return res.json({
      isSuccess: true,
      data: "Earn new item. Check your inventory on the game or the marketplace!",
    });
  } catch (error) {
    await transaction.rollback();
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}

export async function handleAppUpdateHeroStamina(req: IRequest, res: Response) {
  const { id } = req.currentUser;
  const { heroIds, consumeStamina } = req.body;

  const transaction = await Heros.sequelize.transaction();

  try {
    const heros = await Heros.findAll({
      where: {
        status: StatusCode.Active,
        readyToUse: true,
        ownerId: id,
        id: heroIds,
      },
      transaction,
    });

    await Promise.all(
      heros.map((e) =>
        e.update(
          {
            currentStamina: Math.max(+e.currentStamina - +consumeStamina, 0),
          },
          { transaction },
        ),
      ),
    );

    await transaction.commit();

    return res.json({
      isSuccess: true,
      data: "Consume hero stamina successfully",
    });
  } catch (error) {
    await transaction.rollback();
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}

export async function handleAppUpdateHeroStaminaReset(req: IRequest, res: Response) {
  const { id } = req.currentUser;
  const { heroId } = req.body;

  const transaction = await Heros.sequelize.transaction();

  try {
    const hero: Heros = await findOrFail(Heros as any, {
      where: {
        status: StatusCode.Active,
        readyToUse: true,
        ownerId: id,
        id: heroId,
      },
      transaction,
    });

    await hero.update({
      currentStamina: hero.statistic.stamina,
      restTime: null,
      heroStatus: HeroStatus.Ready,
    });

    await transaction.commit();

    return res.json({
      isSuccess: true,
      data: "Reset hero stamina successfully",
    });
  } catch (error) {
    await transaction.rollback();
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}
