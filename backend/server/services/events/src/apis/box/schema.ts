import { Joi } from "shared";
import { ActionTypes, SignatureSchema } from "shared";

export enum InventoryFilterState {
  Sale = "sale",
  Ready = "ready",
}

export const FormGetInventoryBoxes = {
  query: Joi.object().keys({
    page: Joi.number(),
    size: Joi.number(),
    state: Joi.string().valid(InventoryFilterState.Sale, InventoryFilterState.Ready),
    search: Joi.string(),
    quality: Joi.string(),
  }),
};

// Web
export const FormPurchaseBoxes = {
  body: Joi.object().keys({
    boxInfoId: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    ...SignatureSchema(ActionTypes.Purchase),
  }),
};

export const FormOpenBox = {
  body: Joi.object().keys({
    boxId: Joi.string().required(),
    ...SignatureSchema(ActionTypes.OpenBox),
  }),
};
