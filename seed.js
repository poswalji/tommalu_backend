// seed.js
const mongoose = require("mongoose");
const Store = require("./models/Store");
const Item = require("./models/Item");

const RESTAURANTS_DATA = [
    {
        id: 1,
        slug: 'spice-garden',
        name: "Spice Garden",
        type: "restaurant",
        cuisine: "Indian",
        rating: 4.8,
        deliveryTime: "25-30 min",
        distance: 2.5,
        image: "🍛",
        items: [
            { id: 101, name: "Butter Chicken", price: 280, category: "Indian", description: "Creamy tomato-based chicken curry", image: "🍛", popular: true },
            { id: 102, name: "Paneer Tikka", price: 220, category: "Indian", description: "Grilled cottage cheese with spices", image: "🧀", popular: true },
            { id: 103, name: "Chicken Biryani", price: 320, category: "Indian", description: "Fragrant basmati rice with chicken", image: "🍚", popular: true },
            { id: 104, name: "Garlic Naan", price: 45, category: "Indian", description: "Fresh baked Indian bread", image: "🫓" },
            { id: 105, name: "Dal Makhani", price: 180, category: "Indian", description: "Rich black lentil curry", image: "🍲" }
        ]
    },
    {
        id: 2,
        slug: 'pizza-corner',
        name: "Pizza Corner",
        type: "restaurant",
        cuisine: "Italian",
        rating: 4.6,
        deliveryTime: "20-25 min",
        distance: 3.2,
        image: "🍕",
        items: [
            { id: 201, name: "Margherita Pizza", price: 250, category: "Pizza", description: "Classic tomato and mozzarella", image: "🍕", popular: true },
            { id: 202, name: "Pepperoni Pizza", price: 320, category: "Pizza", description: "Spicy pepperoni with cheese", image: "🍕", popular: true },
            { id: 203, name: "Chicken Pasta Alfredo", price: 280, category: "Italian", description: "Creamy white sauce pasta", image: "🍝" },
            { id: 204, name: "Garlic Bread", price: 120, category: "Italian", description: "Buttery garlic bread sticks", image: "🥖" }
        ]
    },
    {
        id: 3,
        slug: 'burger-hub',
        name: "Burger Hub",
        type: "restaurant",
        cuisine: "Fast Food",
        rating: 4.7,
        deliveryTime: "15-20 min",
        distance: 1.8,
        image: "🍔",
        items: [
            { id: 301, name: "Classic Chicken Burger", price: 180, category: "Burgers", description: "Beef patty with lettuce and tomato", image: "🍔", popular: true },
            { id: 302, name: "Chicken Burger Deluxe", price: 200, category: "Burgers", description: "Grilled chicken breast burger", image: "🍔", popular: true },
            { id: 303, name: "French Fries", price: 80, category: "Fast Food", description: "Crispy golden potato fries", image: "🍟", popular: true },
            { id: 304, name: "Chicken Wings", price: 220, category: "Fast Food", description: "Spicy buffalo chicken wings", image: "🍗" }
        ]
    }
];

const GROCERY_DATA = [
    {
        id: 4,
        slug: 'fresh-mart',
        name: "Fresh Mart",
        type: "grocery",
        category: "Supermarket",
        rating: 4.5,
        deliveryTime: "30-40 min",
        distance: 2.1,
        image: "🛒",
        items: [
            { id: 401, name: "Basmati Rice", price: 120, category: "Grains", description: "Premium quality basmati rice 1kg", image: "🌾", popular: true },
            { id: 402, name: "Fresh Milk", price: 60, category: "Dairy", description: "Full cream fresh milk 1L", image: "🥛", popular: true },
            { id: 403, name: "Whole Wheat Bread", price: 40, category: "Bakery", description: "Fresh whole wheat bread loaf", image: "🍞" },
            { 
                id: 404, 
                name: "Fresh Bananas", 
                basePrice: 100, 
                category: "Fruits", 
                description: "Fresh ripe bananas", 
                image: "🍌", 
                popular: true,
                hasWeightOptions: true,
                weightOptions: [
                    { weight: 0.25, label: "250g", price: 25 },
                    { weight: 0.5, label: "500g", price: 50 },
                    { weight: 1, label: "1kg", price: 100 },
                    { weight: 2, label: "2kg", price: 190 }
                ]
            },
            { 
                id: 405, 
                name: "Organic Tomatoes", 
                basePrice: 60, 
                category: "Vegetables", 
                description: "Fresh red tomatoes", 
                image: "🍅",
                hasWeightOptions: true,
                weightOptions: [
                    { weight: 0.25, label: "250g", price: 15 },
                    { weight: 0.5, label: "500g", price: 30 },
                    { weight: 1, label: "1kg", price: 60 },
                    { weight: 2, label: "2kg", price: 110 }
                ]
            },
            { 
                id: 406, 
                name: "Red Onions", 
                basePrice: 40, 
                category: "Vegetables", 
                description: "Fresh red onions", 
                image: "🧅",
                hasWeightOptions: true,
                weightOptions: [
                    { weight: 0.5, label: "500g", price: 20 },
                    { weight: 1, label: "1kg", price: 40 },
                    { weight: 2, label: "2kg", price: 75 }
                ]
            },
            { 
                id: 407, 
                name: "Potatoes", 
                basePrice: 30, 
                category: "Vegetables", 
                description: "Fresh potatoes", 
                image: "🥔",
                hasWeightOptions: true,
                weightOptions: [
                    { weight: 0.5, label: "500g", price: 15 },
                    { weight: 1, label: "1kg", price: 30 },
                    { weight: 2, label: "2kg", price: 55 },
                    { weight: 5, label: "5kg", price: 125 }
                ]
            },
            { id: 408, name: "Chicken Breast", price: 250, category: "Meat", description: "Fresh chicken breast 500g", image: "🍗" }
        ]
    },
    {
        id: 5,
        slug: 'organic-store',
        name: "Organic Store",
        type: "grocery",
        category: "Organic",
        rating: 4.3,
        deliveryTime: "35-45 min",
        distance: 4.1,
        image: "🌱",
        items: [
            { 
                id: 501, 
                name: "Organic Apples", 
                basePrice: 180, 
                category: "Fruits", 
                description: "Certified organic red apples", 
                image: "🍎", 
                popular: true,
                hasWeightOptions: true,
                weightOptions: [
                    { weight: 0.25, label: "250g", price: 45 },
                    { weight: 0.5, label: "500g", price: 90 },
                    { weight: 1, label: "1kg", price: 180 },
                    { weight: 2, label: "2kg", price: 340 }
                ]
            },
            { id: 502, name: "Quinoa Seeds", price: 320, category: "Grains", description: "Organic quinoa seeds 500g", image: "🌾" },
            { id: 503, name: "Almond Milk", price: 150, category: "Dairy", description: "Unsweetened almond milk 1L", image: "🥛" },
            { 
                id: 504, 
                name: "Fresh Spinach", 
                basePrice: 160, 
                category: "Vegetables", 
                description: "Fresh organic spinach", 
                image: "🥬", 
                popular: true,
                hasWeightOptions: true,
                weightOptions: [
                    { weight: 0.25, label: "250g", price: 40 },
                    { weight: 0.5, label: "500g", price: 80 },
                    { weight: 1, label: "1kg", price: 160 }
                ]
            },
            { 
                id: 505, 
                name: "Organic Carrots", 
                basePrice: 80, 
                category: "Vegetables", 
                description: "Fresh organic carrots", 
                image: "🥕",
                hasWeightOptions: true,
                weightOptions: [
                    { weight: 0.5, label: "500g", price: 40 },
                    { weight: 1, label: "1kg", price: 80 },
                    { weight: 2, label: "2kg", price: 150 }
                ]
            },
            { id: 506, name: "Organic Chicken", price: 350, category: "Meat", description: "Free-range organic chicken 1kg", image: "🍗" }
        ]
    }
];

async function seedDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/tommalu", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("MongoDB connected");

        // Clear existing data
        await Item.deleteMany({});
        await Store.deleteMany({});

        // Insert restaurants
        for (const store of RESTAURANTS_DATA) {
            const items = await Item.insertMany(store.items);
            const itemIds = items.map(item => item._id);
            const newStore = new Store({ ...store, items: itemIds });
            await newStore.save();
        }

        // Insert grocery stores
        for (const store of GROCERY_DATA) {
            const items = await Item.insertMany(store.items);
            const itemIds = items.map(item => item._id);
            const newStore = new Store({ ...store, items: itemIds });
            await newStore.save();
        }

        console.log("Database seeded successfully");
        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

seedDB();
