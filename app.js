import express from 'express';
import helmet from 'helmet';
import rateLimiter from './middleware/rateLimiter.js';
// import errorHandler from './middlewares/errorHandler.js';
import cors from './middleware/corsAuth.js'
import authRoute from './routes/auth.js';
import adminRoute from './routes/admin.js';

const createApp = () => {
    const app = express();

    // Security middleware
    // app.use(cors({ origin: "http://127.0.0.1:5500" }))
    app.use(helmet());
    app.use(cors)

    // Parse JSON and URL-encoded data
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rate limiting middleware
    app.use(rateLimiter);

    // API routes
    app.use('/auth', authRoute);
    app.use('/admin', adminRoute)

    // 404 handler
    app.use((req, res, next) => {
        res.status(404).json({ error: 'Not Found' });
    });

    // Error handling middleware
    // app.use(errorHandler);

    return app;
};

export default createApp;