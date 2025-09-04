// routes/storeRoutes.js
const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

// Routes
router.get("/", storeController.getAllStores);
router.get("/:slug", storeController.getStoreBySlug);
router.post("/", storeController.createStore);

module.exports = router;
