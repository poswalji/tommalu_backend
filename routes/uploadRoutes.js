import { Router } from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `img_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

const router = Router();
router.post("/menu-item", protect, allowRoles("owner", "admin"), upload.single("image"), (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
