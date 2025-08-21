import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listActiveRestaurants, getMenu, placeOrder } from "../controllers/userController.js";

const router = Router();

router.get("/restaurants", listActiveRestaurants);
router.get("/restaurants/:id/menu", getMenu);

// user must be logged in to place order
router.post("/orders", protect, placeOrder);

export default router;
