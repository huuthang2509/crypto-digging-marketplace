import * as Joi from "joi";
import { ActionTypes } from "../models";

export const SignatureSchema = (action: ActionTypes) => {
  return {
    sign: Joi.object().keys({
      signature: Joi.string().required(),
      action: Joi.string().valid(action).default(action),
    }),
  };
};
