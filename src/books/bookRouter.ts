import express from "express";
import { addBook } from "./bookController";

const bookRouter = express.Router();

bookRouter.post("/addbook", addBook);

export default bookRouter;
