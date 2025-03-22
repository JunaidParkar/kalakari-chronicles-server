import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No JWT provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        return res.status(403).json({ error: "Unauthorized - Invalid JWT" });
    }
};

export default verifyJWT