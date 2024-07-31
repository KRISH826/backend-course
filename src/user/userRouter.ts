import express from "express";
import { userLogin, userRegister } from "./userController";

const useRouter = express.Router();

useRouter.post("/register", userRegister);
useRouter.post("/login", userLogin);

export default useRouter;
