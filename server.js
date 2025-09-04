import dotenv from "dotenv";
import http from "http";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { connectDB, seedAdmin } from "./config/db.js";
import { initSocket } from "./utils/socket.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes, { stripeWebhook } from "./routes/paymentRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// --- CORS ---
const corsOrigin = process.env.CLIENT_ORIGIN || "*";


// Allow frontend domain for all routes
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}));

// Serve uploads with CORS
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173/'); // match frontend
  }
}));


// --- Security & logs ---
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());




// Stripe webhook needs raw body
app.post("/api/payment/stripe/webhook", express.raw({ type: "*/*" }), stripeWebhook);

// Normal JSON body parsing for other routes
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Static for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- DB ---
await connectDB();
await seedAdmin();

// --- Socket.io ---
const io = initSocket(server, { cors: { origin: corsOrigin } });
app.set("io", io);

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/stores", storeRoutes);
// Health
app.get("/", (req, res) => res.json({ ok: true, service: "Tommalu API" }));

// Error handler (last)
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Tommalu API running on port ${PORT}`));
///////////////////////////
app.get("/api/admin/pending-restaurants", (req, res) => {
    res.json([
        { name: "Burger Junction", owner: "John Smith" },
        { name: "Taco Fiesta", owner: "Carlos Mendez" }
    ]);
});

app.get("/api/restaurant/orders", (req, res) => {
    res.json([
        { id: "ORD001", items: "Butter Chicken, Naan", amount: 420 },
        { id: "ORD002", items: "Margherita Pizza", amount: 280 }
    ]);
});


