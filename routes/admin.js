import fs from 'fs'
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import admin from "../config/firebase.js";
import { addCategory, getCategories, uploadImageMulter } from "../utils/index.js"
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

adminRoute.post("/addProduct", uploadImageMulter, async(req, res) => {
    try {
        const { name, price, madeBy, description, category } = req.body;
        const imageFiles = Object.values(req.files).flat();

        if (!name || !price || !madeBy || !description || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({ error: "At least one image is required" });
        }

        let secureURLs = [];
        let uploadErrors = [];

        await Promise.all(
            imageFiles.map(async(file) => {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "products",
                    });

                    secureURLs.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                } catch (error) {
                    uploadErrors.push(file.path);
                } finally {
                    fs.unlinkSync(file.path);
                }
            })
        );

        if (secureURLs.length === 0) {
            return res.status(500).json({ error: "Failed to upload any images. Please try again. Please delete the post and try again later." });
        }

        await addCategory(category)

        const productRef = admin.firestore().collection("products").doc();
        await productRef.set({
            name,
            price,
            description,
            madeBy,
            category,
            images: secureURLs.map((img) => img.url),
            image_public_ids: secureURLs.map((img) => img.public_id),
            createdAt: new Date().toISOString(),
        });

        res.json({
            id: productRef.id,
            name,
            price,
            madeBy,
            description,
            images: secureURLs,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRoute.post("/getProduct", async(req, res) => {
    let id = req.body.id
    admin.firestore().collection("products").doc(id).get().then(data => {
        res.status(200).json({ product: data.data() })
    }).catch(e => {
        res.status(500).json({ message: e })
    })
})

adminRoute.post("/getCategories", async(req, res) => {
    admin.database().ref("categories").get().then(data => {
        res.status(200).json({ categories: data.val() })
    }).catch(() => {
        res.status(500).json({ message: "Unable to load the category list..." })
    })
})

adminRoute.post("/editProduct")

export default adminRoute