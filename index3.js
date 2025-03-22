import express from "express";
import dotenv from "dotenv";
import { securityMiddleware } from "./backup/middleware/security.js";
import productsRoutes from "./backup/routes/products.js";
import usersRoutes from "./backup/routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Security Middleware
securityMiddleware(app);

// API Routes (🔒 Protected)
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API Server Running!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});