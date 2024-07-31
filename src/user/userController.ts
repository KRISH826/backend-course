import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userSchema";
import bcrypt from "bcrypt";

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "all fields required");
    return next(error);
  }

  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "user already exists");
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  res.json({
    newUser,
    message: "User created successfully",
  });
};
