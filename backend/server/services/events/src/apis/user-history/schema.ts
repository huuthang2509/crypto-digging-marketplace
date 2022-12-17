import { Joi } from "shared";
import { MarketRefType, UserLogAction } from "shared";

export const FormGetUserHistory = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    logType: Joi.string().valid(MarketRefType.Hero, MarketRefType.Box).required(),
    action: Joi.string().valid(
      UserLogAction.Claim,
      UserLogAction.OpenBox,
      UserLogAction.Purchase,
      UserLogAction.SaleUp,
      UserLogAction.SaleDown,
    ),
    pastHourFromNow: Joi.number(),
  }),
};
