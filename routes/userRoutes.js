import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listActiveStores, getStoreMenu, placeOrder } from "../controllers/userController.js";

const router = Router();

// Get all active stores (restaurants + grocery)
router.get("/stores", listActiveStores);

// Get menu/items of a specific store
router.get("/stores/:id/menu", getStoreMenu);

// User must be logged in to place order
router.post("/orders", protect, placeOrder);

export default router;
