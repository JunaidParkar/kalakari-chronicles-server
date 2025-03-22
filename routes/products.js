import express from "express";
import { verifyJWT } from "../middleware/jwtAuth.js";

const router = express.Router();

// 🔒 Protected Route: Fetch Products (Requires JWT)
router.get("/", verifyJWT, async(req, res) => {
    try {
        const products = [
            { id: 1, name: "Product A", price: 100 },
            { id: 2, name: "Product B", price: 150 },
        ];
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

export default router;