import {
  createProblem,
  deleteProblemById,
  getProblemById,
  getProblems,
  getSolvedProblemsByUser,
  updateProblemById,
} from "../controllers/problem.controllers.js";
import express from "express";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";

const problemsRouter = express.Router();

problemsRouter.post("/create-problem", authMiddleware, isAdmin, createProblem);

problemsRouter.get("/get-all-problems", authMiddleware, getProblems);

problemsRouter.get("/get-problem/:id", authMiddleware, getProblemById);

problemsRouter.put("/update-problem/:id",
  authMiddleware,
  isAdmin,
  updateProblemById
);

problemsRouter.delete("/delete-problem/:id",
  authMiddleware,
  isAdmin,
  deleteProblemById
);

problemsRouter.get("/get-solved-problems", authMiddleware, getSolvedProblemsByUser);


export default problemsRouter;
