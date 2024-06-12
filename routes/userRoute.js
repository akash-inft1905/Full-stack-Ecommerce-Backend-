import express from "express";
import {
  forgotPassword,
  generateOtp,
  getUserProfileCtrl,
  loginUserCtrl,
  registerUserCtrl,
  resetPassword,
  updateShippingAddresctrl,
  verifyOtp,
} from "../controllers/userCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);

userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddresctrl);

// Route to generate OTP
userRoutes.post("/generate-otp", isLoggedIn, generateOtp);

// Route to verify OTP
userRoutes.post("/verify-otp", isLoggedIn, verifyOtp);

// Route to handle forgot password
userRoutes.post("/forgot-password", forgotPassword);

// Route to handle reset password
userRoutes.post("/reset-password/:token", resetPassword);

export default userRoutes;
