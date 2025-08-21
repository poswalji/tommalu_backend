import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createStripeCheckout, stripeWebhookHandler, createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";

const router = Router();

// Stripe
export const stripeWebhook = stripeWebhookHandler; // used in server.js
router.post("/stripe/checkout", protect, createStripeCheckout);

// Razorpay
router.post("/razorpay/order", protect, createRazorpayOrder);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);

export default router;
