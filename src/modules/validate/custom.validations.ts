import { CustomHelpers } from "joi";

export function objectId(value: string, helpers: CustomHelpers) {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ custom: "'{{#label}}' must be a valid mongo id" });
  }
  return value;
}

export function password(value: string, helpers: CustomHelpers) {
  if (value.length < 8) {
    return helpers.message({
      custom: "password must be at least 8 characters",
    });
  }
  if (value.length > 32) {
    return helpers.message({
      custom: "password must be no more than 32 characters",
    });
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({
      message: "password must contain at least 1 number and 1 letter",
    });
  }
  return value;
}
