import asyncHandler from "express-async-handler";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";

const getOwnerRestaurant = async (ownerId) => Restaurant.findOne({ ownerId });

export const getMenu = asyncHandler(async (req, res) => {
  const r = await getOwnerRestaurant(req.user._id);
  if (!r) return res.status(404).json({ message: "Restaurant not found" });
  const items = await MenuItem.find({ restaurantId: r._id });
  res.json(items);
});

export const addMenuItem = asyncHandler(async (req, res) => {
  const r = await getOwnerRestaurant(req.user._id);
  if (!r) return res.status(404).json({ message: "Restaurant not found" });
  const { name, price, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  const item = await MenuItem.create({ restaurantId: r._id, name, price, description, image });
  res.status(201).json(item);
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const r = await getOwnerRestaurant(req.user._id);
  const { id } = req.params;
  const item = await MenuItem.findOne({ _id: id, restaurantId: r._id });
  if (!item) return res.status(404).json({ message: "Item not found" });
  const { name, price, description } = req.body;
  if (name) item.name = name;
  if (price) item.price = price;
  if (description) item.description = description;
  if (req.file) item.image = `/uploads/${req.file.filename}`;
  await item.save();
  res.json(item);
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const r = await getOwnerRestaurant(req.user._id);
  const { id } = req.params;
  const item = await MenuItem.findOneAndDelete({ _id: id, restaurantId: r._id });
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json({ message: "Deleted" });
});

export const getOrders = asyncHandler(async (req, res) => {
  const r = await getOwnerRestaurant(req.user._id);
  if (!r) return res.status(404).json({ message: "Restaurant not found" });
  const orders = await Order.find({ restaurantId: r._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const r = await getOwnerRestaurant(req.user._id);
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findOne({ _id: id, restaurantId: r._id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = status || order.status;
  await order.save();

  const io = req.app.get("io");
  io.to(`user_${order.userId}`).emit("order_status", { orderId: order._id, status: order.status });

  res.json(order);
});
