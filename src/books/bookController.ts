import { NextFunction, Request, Response } from "express";

export const addBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: "Book added successfully",
  });
};
