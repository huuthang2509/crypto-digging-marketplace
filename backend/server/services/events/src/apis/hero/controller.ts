import { Response } from "express";
import moment from "moment-timezone";
import { Op } from "sequelize";
import {
  filterPagination,
  Heros,
  HeroStatus,
  IRequest,
  parsePaginationParams,
  responseError,
  StatusCode,
} from "shared";
import { InventoryFilterState } from "../box/schema";
import { serializeHeroResponse, standardizeAppHero } from "./serialize";

export async function handleGetHeros(req: IRequest, res: Response) {
  const { id } = req.currentUser;
  const { state, search, quality } = req.query;

  try {
    const { data, pagination } = await filterPagination(
      Heros as any,
      {
        where: {
          ...(state ? { readyToUse: state === InventoryFilterState.Ready } : null),
          ...((quality as string)?.split(",").length ? { quality: { [Op.in]: (quality as string).split(",") } } : null),
          ...(search
            ? { [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { description: { [Op.iLike]: `%${search}%` } }] }
            : null),
          status: StatusCode.Active,
          ownerId: id,
        },
        order: [["createdAt", "DESC"]],
      },
      parsePaginationParams(req.query),
    );

    return res.json({
      data: await serializeHeroResponse(data as Heros[]),
      pagination,
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}

export async function handleGetAppHeros(req: IRequest, res: Response) {
  const { id } = req.currentUser;

  try {
    const heros = await Heros.findAll({
      where: {
        status: StatusCode.Active,
        readyToUse: true,
        ownerId: id,
      },
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["readyToUse"],
      },
    });

    return res.json({
      isSuccess: true,
      data: heros.map(standardizeAppHero),
    });
  } catch (error) {
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}

export async function handlePostAppHeroRest(req: IRequest, res: Response) {
  const { heroId, heroStatus } = req.body;
  const { id } = req.currentUser;

  try {
    const hero = await Heros.findOne({
      where: {
        status: StatusCode.Active,
        readyToUse: true,
        ownerId: id,
        id: heroId,
      },
    });

    await hero.update({
      restTime: heroStatus === HeroStatus.Sleep ? moment() : null,
      currentStamina:
        heroStatus === HeroStatus.Ready && hero.heroStatus === HeroStatus.Sleep
          ? Math.min(
              +hero.currentStamina + +(moment().diff(moment(hero.restTime), "hours") / 10),
              +hero.statistic.stamina,
            )
          : undefined,
      heroStatus,
    });

    return res.json({
      isSuccess: true,
      data: "Update hero status successfully",
    });
  } catch (error) {
    return responseError(req, res, error, { statusCode: 200, additionResp: { isSuccess: false } });
  }
}
