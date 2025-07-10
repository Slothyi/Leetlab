import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        Message: "Unauthorized - No token provided",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        Message: "Unauthorized - Invalid token",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error occurred in the middleware\n", error.message);
    return res.status(400).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userId =  req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    console.log(user,"\n",userId);
    

    if (!user || user.role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Access denied - Admins only",
      });
    }

    next();
  } catch (error) {
    console.log("Error checking admin role: ",error.message)
    return res.status(500).json({
      success: false,
      message: "Error checking admin role"
    })
  }
};
 