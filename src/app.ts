import express from "express";
import createHttpError from "http-errors";
import ErrorHandler from "./middlewares/errorHandler";

const app = express();
// routes
app.get("/", (req, res) => {
  const error = createHttpError(400, "Not Found");
  throw error;
  res.send("hi there");
});

// app.use();

app.use(ErrorHandler);

export default app;
