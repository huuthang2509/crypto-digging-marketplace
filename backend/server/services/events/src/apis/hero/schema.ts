import * as Joi from "joi";
import { HeroStatus } from "shared";
import { InventoryFilterState } from "../box/schema";

export const FormGetInventoryHeros = {
  query: Joi.object().keys({
    page: Joi.number(),
    size: Joi.number(),
    state: Joi.string().valid(InventoryFilterState.Sale, InventoryFilterState.Ready),
    search: Joi.string(),
    quality: Joi.string(),
  }),
};

export const FormPostRestHero = {
  body: Joi.object().keys({
    heroId: Joi.string().required(),
    heroStatus: Joi.string().valid(HeroStatus.Ready, HeroStatus.Sleep).required(),
  }),
};
