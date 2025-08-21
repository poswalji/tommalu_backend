import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "secret"
});

export const createStripeCheckout = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: `Order ${order._id}` },
          unit_amount: Math.round(order.totalAmount * 100)
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.CLIENT_ORIGIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_ORIGIN}/cancel.html`
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.json({ url: session.url });
});

export const stripeWebhookHandler = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    if (webhookSecret) {
      event = Stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.paymentStatus = "paid";
        await order.save();
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const rpOrder = await razorpay.orders.create({
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: `order_rcptid_${order._id}`
  });

  order.razorpayOrderId = rpOrder.id;
  await order.save();

  res.json({ orderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const sign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");

  if (sign !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }
  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.paymentStatus = "paid";
  await order.save();
  res.json({ message: "Payment verified" });
});
