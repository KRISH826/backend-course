import express from "express";
import ErrorHandler from "./middlewares/errorHandler";
import useRouter from "./user/userRouter";
import bookRouter from "./books/bookRouter";

const app = express();
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
