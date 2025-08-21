import asyncHandler from "express-async-handler";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";

export const listActiveRestaurants = asyncHandler(async (req, res) => {
  const list = await Restaurant.find({ status: "active" }).select("name cuisine deliveryTime deliveryFee");
  res.json(list);
});

export const getMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const items = await MenuItem.find({ restaurantId: id });
  res.json(items);
});

export const placeOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items, totalAmount, paymentMethod } = req.body;
  if (!restaurantId || !Array.isArray(items) || !totalAmount) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const order = await Order.create({
    userId: req.user._id,
    restaurantId,
    items,
    totalAmount,
    paymentMethod: paymentMethod || "cod",
    paymentStatus: paymentMethod === "cod" ? "unpaid" : "unpaid"
  });

  const io = req.app.get("io");
  io.to(`restaurant_${restaurantId}`).emit("new_order", { orderId: order._id });

  res.status(201).json(order);
});
