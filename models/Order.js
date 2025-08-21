import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, default: 1 }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "accepted", "delivered", "cancelled"], default: "pending" },
    paymentMethod: { type: String, enum: ["stripe", "upi", "cod"], default: "cod" },
    paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    razorpayOrderId: String,
    stripeSessionId: String
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
