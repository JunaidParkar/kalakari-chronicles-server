import admin from "firebase-admin";
import dotenv from "dotenv";
import service from "../serviceAccountKey.json"

dotenv.config();

const serviceAccount = JSON.parse(service);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;