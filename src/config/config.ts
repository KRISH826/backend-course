import { config as conf } from "dotenv";

conf();
const _config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  env: process.env.NODE_ENV,
  jwt_token: process.env.JWT_TOKEN,
  cloudinaryCloud: process.env.CLOUD_NAME,
  cloudinaryAPI: process.env.CLOUD_API_KEY,
  cloudinarySecret: process.env.CLOUD_API_SECRET_KEY,
  frontend_url: process.env.FRONTEND_URL,
};

export const config = Object.freeze(_config);
