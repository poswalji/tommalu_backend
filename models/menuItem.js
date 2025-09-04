import mongoose from "mongoose";


const WeightOptionSchema = new mongoose.Schema({
  weight: Number,
  label: String,
  price: Number
});

const MenuItem = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  price: Number,
  basePrice: Number,
  category: String,
  description: String,
  image: String,
  popular: { type: Boolean, default: false },
  hasWeightOptions: { type: Boolean, default: false },
  weightOptions: [WeightOptionSchema]
});

module.exports = mongoose.model("Item", MenuItem);