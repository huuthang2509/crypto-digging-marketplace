import { Response } from "express";
import moment from "moment-timezone";
import { Op } from "sequelize";
import {
  filterPagination,
  IRequest,
  parsePaginationParams,
  responseError,
  safeParseInt,
  skipValueObject,
  UsersLogs,
} from "shared";

// Histories
export async function getUserHistory(req: IRequest, res: Response) {
  try {
    const { logType, action, pastHourFromNow } = req.query;

    const { data, pagination } = await filterPagination(
      UsersLogs as any,
      {
        where: skipValueObject({
          logType,
          action,
          createdAt: pastHourFromNow
            ? {
                [Op.between]: [moment(), moment().add(safeParseInt(pastHourFromNow as string, 0), "hours")],
              }
            : null,
        }),
        order: [["createdAt", "DESC"]],
      },
      parsePaginationParams(req.query),
    );

    return res.json({
      data,
      pagination,
    });
  } catch (error) {
    return responseError(req, res, error);
  }
}
