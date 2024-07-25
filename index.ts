import app from "./src/app";
import { config } from "./src/config/config";
import { connectDb } from "./src/config/db";

/** @format */
const startServer = async () => {
  const port = config.port || 3300;

  await connectDb();

  app.listen(port, () => {
    console.log(`Starting server: ${port}`);
  });
};

startServer();
