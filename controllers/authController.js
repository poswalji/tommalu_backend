import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Restaurant from "../models/Store.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// --- REGISTER WITH OTP ---
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, restaurant } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: "Missing fields" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const hash = await bcrypt.hash(password, 10);
  const status = role === "owner" ? "pending" : "active";

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    name,
    email,
    phone,
    password: hash,
    role: role || "user",
    status,
    otp,
    otpExpires: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  // Create restaurant if owner
  if (role === "owner" && restaurant) {
    await Restaurant.create({
      name: restaurant.name || `${name}'s Restaurant`,
      ownerId: user._id,
      address: restaurant.address || "NA",
      cuisine: restaurant.cuisine || "",
      deliveryTime: restaurant.deliveryTime || 30,
      deliveryFee: restaurant.deliveryFee || 0,
      status: "pending"
    });
  }

  // TODO: send OTP via SMS/email (currently console log)
  console.log("🔐 OTP for", email, ":", otp);

  return res.status(201).json({
    message: "Registered successfully. Please verify OTP.",
    user: { id: user._id, email: user.email, phone: user.phone }
  });
});

// --- VERIFY OTP ---
export const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  const token = genToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: "OTP Verified Successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    }
  });
});

// --- RESEND OTP ---
export const resendOtp = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  // TODO: Send via SMS/email
  console.log("🔄 Resent OTP:", otp);

  res.json({ message: "OTP resent successfully" });
});


// --- LOGIN ---
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  if (user.role === "owner" && user.status !== "active")
    return res.status(403).json({ message: "Owner not approved yet" });

  const token = genToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: "Logged in successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    }
  });
});

// --- GOOGLE AUTH ---
export const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "No token provided" });

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  const { email, name,} = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      password: null, // google se aya hai, password nahi
      phone: "",
      role: "user",
      status: "active"
    });
  }

  const authToken = genToken(user._id);
  res.cookie("token", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: "Google authentication successful",
    user: {
      
      name: user.name,
      email: user.email,
      
    }
  });
});

// --- VERIFY TOKEN ---
export const verifyToken = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// --- LOGOUT ---
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict"
  });
  res.json({ success: true, message: "Logged out successfully" });
});
  