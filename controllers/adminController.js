import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";

export const listRestaurants = asyncHandler(async (req, res) => {
  const list = await Restaurant.find().populate("ownerId", "name email status");
  res.json(list);
});

export const approveRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const r = await Restaurant.findById(id);
  if (!r) return res.status(404).json({ message: "Restaurant not found" });
  r.status = "active";
  await r.save();
  const owner = await User.findById(r.ownerId);
  if (owner) {
    owner.status = "active";
    await owner.save();
  }
  res.json({ message: "Approved" });
});

export const disableRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const r = await Restaurant.findById(id);
  if (!r) return res.status(404).json({ message: "Restaurant not found" });
  r.status = "disabled";
  await r.save();
  res.json({ message: "Disabled" });
});

export const listOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json(orders);
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export const banUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const u = await User.findById(id);
  if (!u) return res.status(404).json({ message: "User not found" });
  u.status = "disabled";
  await u.save();
  res.json({ message: "User banned" });
});
