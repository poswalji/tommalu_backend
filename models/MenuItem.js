import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
