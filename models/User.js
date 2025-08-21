import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true, 
      minlength: [2, "Name must be at least 2 characters"] 
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address"
      }
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: (v) => /^\+?[0-9]{10,15}$/.test(v),
        message: "Invalid phone number"
      }
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    role: { 
      type: String, 
      enum: ["admin", "owner", "user"], 
      default: "user" 
    },
    status: { 
      type: String, 
      enum: ["active", "pending", "disabled"], 
      default: "active" 
    },
    // Optional: for future token blacklist or refresh token system
    refreshToken: { 
      type: String 
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
