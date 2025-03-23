import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import admin from "../config/firebase.js";
import { upload } from "../utils/index.js"
import cloudinary from "../config/cloudinary.js";

const adminRoute = Router();

adminRoute.post("/register", async(req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        await admin.database().ref(`admin/`).set({
            username,
            password: hashedPassword
        });

        res.status(200).json({ message: "Admin registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin.", error });
    }
})

adminRoute.post("/login", async(req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required." });
    }

    // try {
    const snapshot = await admin.database().ref(`admin`).once('value');
    const adminData = snapshot.val();

    if (!adminData) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, adminData.password);
    if (!isPasswordValid || username != adminData.username) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT (expires in 1 hour)
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token });
    // } catch (error) {
    //     res.status(500).json({ message: "Login failed.", error });
    // }
})

adminRoute.post("/addProduct", upload.array("images", 4), async(req, res) => {
    try {
        const { productName, price, madeBy, description } = req.body;
        const imageFiles = req.files; // Uploaded images
        console.log(imageFiles)

        if (!productName || !price || !madeBy || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({ error: "At least one image is required" });
        }

        // Upload each image to Cloudinary and get URLs
        const uploadedImages = await Promise.all(
            imageFiles.map(async(file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "ecommerce_products",
                    transformation: [{ width: 500, height: 500, crop: "limit" }],
                });
                fs.unlinkSync(file.path); // Remove temp file
                return result.secure_url;
            })
        );

        // Response with Cloudinary image URLs and form data
        res.json({
            productName,
            price,
            madeBy,
            description,
            images: uploadedImages,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default adminRoute