import express from "express";
import { loginUser, registerUser, forgotPassword, resetPassword, testEmailRoute } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/test-email", testEmailRoute);

export default userRouter;
