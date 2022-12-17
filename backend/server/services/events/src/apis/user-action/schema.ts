import { Joi } from "shared";
import { ActionTypes } from "shared";

// Web
export const GenerateSignature = {
  body: Joi.object().keys({
    action: Joi.string().valid(...Object.values(ActionTypes)),
  }),
};

export const VerifyActionSignature = {
  body: Joi.object().keys({
    signature: Joi.string().required(),
    action: Joi.string().required(),
  }),
};
