import Joi from "joi";
import { objectId, password } from "../validate";

export const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid("user", "admin"),
    auth_type: Joi.string().default("standalone").valid("google", "standalone"),
  }),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    auth_type: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().custom(password),
    name: Joi.string(),
  })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
