import { Joi } from "shared";

// Web
export const FormAuthSignIn = {
  body: Joi.object().keys({
    nonce: Joi.string().required(),
    signature: Joi.string().required(),
    walletAddress: Joi.string().required(),
  }),
};

export const FormAuthSignUp = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

// App
export const FormAppSignIn = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
