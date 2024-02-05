import express from "express";
import {
  signup,
  login,
  logout,
  getAll,
  getOne,
  updateUser,
  deleteUser,
  gsignup,
} from "../controllers/userController.js";
import upload from "../middlewares/uploadImage.js";
import { authorized, checkRole } from "../middlewares/authorization.js";

export const userRouter = express.Router();

userRouter.post("/signup", upload.single("picture"), signup);
userRouter.post("/gsignup", upload.single("picture"), gsignup);
userRouter.post("/login", login);

userRouter.get("/getone", getOne);
userRouter.get("/logout", authorized, logout);
userRouter.get("/getall", getAll);

userRouter.patch("/:id", upload.single("picture"), updateUser);

userRouter.delete("/:id", checkRole, deleteUser);
