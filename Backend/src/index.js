import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import problemRouter from "./routes/problem.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.listen(port, () => {
  console.log(`\nApp is listening on port ${port}`);
});

//creating endpoint
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to LeetLab",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemRouter);
