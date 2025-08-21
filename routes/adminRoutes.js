import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { listRestaurants, approveRestaurant, disableRestaurant, listOrders, listUsers, banUser } from "../controllers/adminController.js";

const router = Router();
router.use(protect, allowRoles("admin"));

router.get("/restaurants", listRestaurants);
router.patch("/restaurants/:id/approve", approveRestaurant);
router.patch("/restaurants/:id/disable", disableRestaurant);

router.get("/orders", listOrders);
router.get("/users", listUsers);
router.patch("/users/:id/ban", banUser);


// routes/adminRoutes.js

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        if (admin.password !== password) {   // abhi plain text, later bcrypt use karna
            return res.status(400).json({ message: "Invalid password" });
        }

        res.json({
            message: "Login successful",
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});



export default router;
