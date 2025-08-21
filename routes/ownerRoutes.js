import { Router } from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, getOrders, updateOrderStatus } from "../controllers/ownerController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `menu_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

const router = Router();
router.use(protect, allowRoles("owner", "admin"));

router.get("/menu", getMenu);
router.post("/menu", upload.single("image"), addMenuItem);
router.patch("/menu/:id", upload.single("image"), updateMenuItem);
router.delete("/menu/:id", deleteMenuItem);

router.get("/orders", getOrders);
router.patch("/orders/:id/status", updateOrderStatus);

export default router;
