import express from "express";
import {
  login,
  logout,
  register,
  check,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

//creating endpoints
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/check", authMiddleware, check);

export default authRouter;
