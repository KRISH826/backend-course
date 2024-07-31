import express from "express";
import createHttpError from "http-errors";
import ErrorHandler from "./middlewares/errorHandler";
import useRouter from "./user/userRouter";

const app = express();
app.use(express.json());
// routes
app.get("/", (req, res) => {
  res.send("hi there");
});

// app.use();
app.use("/api/users", useRouter);
app.use(ErrorHandler);

export default app;
