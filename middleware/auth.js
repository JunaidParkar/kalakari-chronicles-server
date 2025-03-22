// middleware/authMiddleware.js
import admin from '../config/firebaseConfig.js';
import jwt from 'jsonwebtoken';

// Verify Firebase Token for User Routes
export const verifyFirebaseToken = async(req, res, next) => {
    const token = req.headers.authorization ? .split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Verify JWT for Product Routes
export const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
};