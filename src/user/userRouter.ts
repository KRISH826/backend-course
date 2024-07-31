import express from "express";
import { userRegister } from "./userController";

const useRouter = express.Router();

useRouter.post("/register", userRegister);

export default useRouter;
