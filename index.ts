import app from "./src/app";
import { config } from "./src/config/config";

/** @format */
const startServer = () => {
  const port = config.port || 3300;

  app.listen(port, () => {
    console.log(`Starting server: ${port}`);
  });
};

startServer();
