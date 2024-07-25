import { config as conf } from "dotenv";

conf();
const _config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
};

export const config = Object.freeze(_config);
