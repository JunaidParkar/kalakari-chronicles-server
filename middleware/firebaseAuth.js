import admin from "../config/firebase.js";

const verifyFirebaseToken = async(req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No Firebase token provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach Firebase user data
        next();
    } catch (error) {
        return res.status(403).json({ error: "Unauthorized - Invalid Firebase token" });
    }
};


export default verifyFirebaseToken