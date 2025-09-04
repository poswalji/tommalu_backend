// controllers/storeController.js
const Store = require("../models/Store");
const Item = require("../models/Item");

// GET all stores
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate("items");
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET store by slug
exports.getStoreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const store = await Store.findOne({ slug }).populate("items");
    if (!store) return res.status(404).json({ error: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new store
exports.createStore = async (req, res) => {
  try {
    const { items, ...storeData } = req.body;

    const itemDocs = await Item.insertMany(items);
    const itemIds = itemDocs.map(item => item._id);

    const store = new Store({ ...storeData, items: itemIds });
    await store.save();

    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
