// config/firebaseConfig.js
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json'; // Replace with your Firebase service account key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;