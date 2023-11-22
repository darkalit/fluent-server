import Joi from "joi";
import { objectId } from "../validate";

export const getWords = {
  query: Joi.object().keys({
    ukr: Joi.string(),
    eng: Joi.string(),
    category: Joi.string(),
    theme: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getWord = {
  params: Joi.object().keys({
    wordId: Joi.string().custom(objectId),
  }),
};
