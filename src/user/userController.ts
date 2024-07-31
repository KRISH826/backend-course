import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userSchema";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userType";

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

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "user already exists");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(400, "error while getting user"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = sign({ sub: newUser._id }, config.jwt_token as string, {
    expiresIn: "1d",
    algorithm: "HS256",
  });

  res.status(201).json({
    accessToken: token,
    newUser,
    message: "User created successfully",
  });
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "All Fields Required"));
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(400, "User Not Found"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Password mismatch"));
    }

    const token = sign({ sub: user._id }, config.jwt_token as string, {
      expiresIn: "1d",
      algorithm: "HS256",
    });
    res.json({
      accessToken: token,
      user,
      message: "User login successfully",
    });
  } catch (error) {
    return next(createHttpError(400, "error while getting user"));
  }
};
