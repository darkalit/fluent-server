import Joi from "joi";
import { objectId } from "../validate";

export const changeTheme = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    themes: Joi.array().items(Joi.string().custom(objectId)).required(),
  }),
};

export const changeWordsDailyCount = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    wordsCount: Joi.number().integer().min(1).required(),
  }),
};
