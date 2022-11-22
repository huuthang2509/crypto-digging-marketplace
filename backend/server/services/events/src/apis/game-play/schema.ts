import * as Joi from "joi";
import { GameStatus, HeroBoxesType, MarketRefType } from "shared";

// App
export const FormCreateGamePlay = {
  body: Joi.object().keys({}),
};

export const FormUpdateGamePlay = {
  body: Joi.object()
    .keys({
      id: Joi.string().required(),
      profitLevel: Joi.number().min(1),
      speedLevel: Joi.number().min(1),
      workerLevel: Joi.number().min(1),
      log: Joi.object(),
      gameStatus: Joi.string()
        .valid(GameStatus.Created, GameStatus.OnGoing, GameStatus.Ended)
        .default(GameStatus.OnGoing),
      CDGBonus: Joi.number().min(0),
      heroSpawned: Joi.string(),
    })
    .min(2),
};

export const FormUpdateHeroConsumStamina = {
  body: Joi.object().keys({
    heroIds: Joi.array().items(Joi.string()),
    consumeStamina: Joi.number().min(0),
  }),
};

export const FormUpdateHeroConsumStaminaReset = {
  body: Joi.object().keys({
    heroId: Joi.string().required(),
  }),
};

export const FormEarnItem = {
  body: Joi.object().keys({
    type: Joi.string().valid(MarketRefType.Hero, MarketRefType.Box).required(),
    quality: Joi.string()
      .valid(HeroBoxesType.Common, HeroBoxesType.Rare, HeroBoxesType.Epic, HeroBoxesType.Legend)
      .required(),
  }),
};
