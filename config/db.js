import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
};

export const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "tommalu@gmail.com";
  const pwd = process.env.ADMIN_PASSWORD || "admin@9358";
  const name = process.env.ADMIN_NAME || "Tommalu Admin";

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      existing.status = "active";
      await existing.save();
    }
    console.log("ℹ️ Admin already exists");
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pwd, salt);
  await User.create({
    name,
    email,
    password: hash,
    role: "admin",
    status: "active"
  });
  console.log("✅ Admin seeded:", email);
};
