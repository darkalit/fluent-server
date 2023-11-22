import Joi from "joi";
import { objectId } from "../validate";

export const sendAnswers = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    answers: Joi.array().items(
      Joi.object().keys({
        test: Joi.string().custom(objectId),
        correct: Joi.alternatives().try(Joi.string(), Joi.number().integer())
          .required(),
      }),
    ).required(),
  }),
};
