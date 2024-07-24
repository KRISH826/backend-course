import app from "./src/app";

/** @format */
const startServer = () => {
  const port = process.env.PORT || 3300;

  app.listen(port, () => {
    console.log(`Starting server${port}`);
  });
};

startServer();
