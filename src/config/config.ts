import Joi from "joi";
import "dotenv/config";

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(7070),
    MONGO_DB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description(
      "JWT secret key",
    ),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description(
      "minutes after which access tokens expire",
    ),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description(
      "days after which refresh tokens expire",
    ),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({
  errors: { label: "key" },
}).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_DB_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
    },
  },
};

export default config;
