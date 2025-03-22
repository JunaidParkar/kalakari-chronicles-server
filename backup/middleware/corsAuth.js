// middleware/corsMiddleware.js
import cors from 'cors';

const corsOptions = {
    origin: process.env.CLIENT_URL || 'https://your-nextjs-app.firebaseapp.com', // Replace with your Firebase-hosted URL
    optionsSuccessStatus: 200,
};

export default cors(corsOptions);