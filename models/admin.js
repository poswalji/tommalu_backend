import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  name: { type: String, default: "Food Delivery Admin" },
  role: { type: String, default: "super_admin" }
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
