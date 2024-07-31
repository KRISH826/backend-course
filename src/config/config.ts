import { config as conf } from "dotenv";

conf();
const _config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  env: process.env.NODE_ENV,
  jwt_token: process.env.JWT_TOKEN,
};

export const config = Object.freeze(_config);
