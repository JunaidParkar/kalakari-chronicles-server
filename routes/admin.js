import { Router } from "express";
import admin from "../config/firebase.js";
import { upload } from "../utils/index.js"
import cloudinary from "../config/cloudinary.js";

const adminRoute = Router();

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