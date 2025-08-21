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


app.get("/api/restaurants", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Spice Garden",
            cuisine: "Indian",
            rating: 4.3,
            deliveryTime: "30-40 min",
            deliveryFee: 2.99,
            image: "https://images.unsplash.com/photo-1604908812279-4b7a6e2d2b66?auto=format&fit=crop&w=800&q=80" // Indian thali
        },
        {
            id: 2,
            name: "Bombay Street Bites",
            cuisine: "Indian Fast Food",
            rating: 4.6,
            deliveryTime: "20-30 min",
            deliveryFee: 1.99,
            image: "https://images.unsplash.com/photo-1598514982586-70f7749a63b6?auto=format&fit=crop&w=800&q=80" // Chaat
        },
        {
            id: 3,
            name: "Pizza Palace",
            cuisine: "Italian",
            rating: 4.7,
            deliveryTime: "25-35 min",
            deliveryFee: 3.49,
            image: "http://localhost:8080/uploads/369063.jpg" // Pizza
        }
    ]);
});
