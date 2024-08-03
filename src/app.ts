import express from "express";
import ErrorHandler from "./middlewares/errorHandler";
import useRouter from "./user/userRouter";
import bookRouter from "./books/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();
app.use(
  cors({
    origin: config.frontend_url,
  })
);
app.use(express.json());
// routes
app.get("/", (req, res) => {
  res.send("hi there");
});

// app.use();
app.use("/api/users", useRouter);
app.use("/api/books", bookRouter);
app.use(ErrorHandler);

export default app;
