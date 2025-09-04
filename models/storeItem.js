// models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },     // Item name
  price: { type: Number, required: true },    // Price of item
  rating: { type: Number, default: 0 },       // Optional rating
  category: { type: String },                 // e.g., "Pizza", "Beverage"
  img: { type: String },                      // Image URL
  tags: { type: [String], default: [] },      // e.g., ["Spicy", "Veg"]

  // Store restaurantId directly (no populate needed)
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);
