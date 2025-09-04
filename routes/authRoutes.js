import { Router } from "express";
import { register, login, verifyToken, logout,verifyOtp,resendOtp, googleAuth } from "../controllers/authController.js";

const router = Router();

// Email-Password Auth
router.post("/register", register);
router.post("/login", login);

// Google Auth
router.post("/google", googleAuth);

// Verify JWT
router.get("/verify", verifyToken);

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Logout
router.post("/logout", logout);

export default router;
