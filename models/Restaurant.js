import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    cuisine: { type: String, default: "" },
    deliveryTime: { type: Number, default: 30 },
    deliveryFee: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "pending", "disabled"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
