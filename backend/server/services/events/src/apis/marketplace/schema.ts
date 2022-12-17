import { Joi } from "shared";
import { ActionTypes, MarketRefType, SignatureSchema } from "shared";

export enum MarketFilerSort {
  Latest = '[["createdAt", "DESC"]]',
  Cheap = '[["CDGPrice", "ASC"]]',
  Expensive = '[["CDGPrice", "DESC"]]',
}

export const FormGetMarketPlace = {
  query: Joi.object().keys({
    type: Joi.string().valid(MarketRefType.Hero, MarketRefType.Box).required(),
    page: Joi.number().required(),
    size: Joi.number().required(),
    sort: Joi.string().valid(MarketFilerSort.Latest, MarketFilerSort.Cheap, MarketFilerSort.Expensive),
    quality: Joi.string(),
    search: Joi.string(),
    priceFrom: Joi.number(),
    priceTo: Joi.number(),
  }),
};

export const FormGetOneMarketPlace = {
  params: Joi.object().keys({
    itemId: Joi.string().required(),
  }),
};

export const FormSaleItem = {
  body: Joi.object().keys({
    refId: Joi.string().required(),
    refType: Joi.string().valid(MarketRefType.Hero, MarketRefType.Box).required(),
    CDGPrice: Joi.number().greater(0).required(),
    ...SignatureSchema(ActionTypes.SendToMarket),
  }),
};

export const FormRemoveItem = {
  body: Joi.object().keys({
    refId: Joi.string().required(),
    refType: Joi.string().valid(MarketRefType.Hero, MarketRefType.Box).required(),
    ...SignatureSchema(ActionTypes.Remove),
  }),
};

export const FormPurchaseItem = {
  body: Joi.object().keys({
    refId: Joi.string().required(),
    refType: Joi.string().valid(MarketRefType.Hero, MarketRefType.Box).required(),
    ...SignatureSchema(ActionTypes.Purchase),
  }),
};
