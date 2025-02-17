import express from "express";
import {
  addBook,
  deleteBook,
  getallBook,
  getsingleBook,
  updateBook,
} from "./bookController";
import multer from "multer";
import path from "node:path";
import { authenticateUser } from "../middlewares/authenticate";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  "/addbook",
  authenticateUser,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addBook
);

bookRouter.put(
  "/update/:id",
  authenticateUser,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);
bookRouter.get("/booklist", getallBook);
bookRouter.get("/book/:id", getsingleBook);
bookRouter.delete("/deletebook/:id", authenticateUser, deleteBook);

export default bookRouter;
