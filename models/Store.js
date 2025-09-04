import mongoose from "mongoose";

const Item = require("./Item");

const StoreSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["restaurant", "grocery"], required: true },
  cuisine: String, // for restaurants
  category: String, // for grocery
  rating: Number,
  deliveryTime: String,
  distance: Number,
  image: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
});