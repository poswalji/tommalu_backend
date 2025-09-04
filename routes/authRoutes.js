import { Router } from "express";
import { register, login, verifyToken, logout, googleAuth } from "../controllers/authController.js";

const router = Router();

// Email-Password Auth
router.post("/register", register);
router.post("/login", login);

// Google Auth
router.post("/google", googleAuth);

// Verify JWT
router.get("/verify", verifyToken);

// Logout
router.post("/logout", logout);

export default router;
