import { Joi } from "shared";
import { ActionTypes, SignatureSchema } from "shared";

// Web
export const FormTransferCGD = {
  body: Joi.object().keys({
    amount: Joi.number().min(0.000000001).required(),
    ...SignatureSchema(ActionTypes.Payment),
  }),
};
