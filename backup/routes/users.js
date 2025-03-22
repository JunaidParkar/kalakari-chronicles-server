import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyJWT } from "../backup/middleware/jwtAuth.js";
import { verifyFirebaseToken } from "../backup/middleware/firebaseAuth.js";

dotenv.config();
const router = express.Router();

const users = []; // Fake user database (replace with actual DB)

// 🔐 Register User
router.post("/register", async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    res.json({ message: "User registered successfully" });
});

// 🔐 Login User (Returns JWT)
router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// 🔒 Protected Route: Get User Profile (Requires Firebase Auth)
router.get("/profile", verifyFirebaseToken, (req, res) => {
    res.json({ message: "User Profile Data", user: req.user });
});

export default router;