import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = [process.env.FRONTEND_URL];

export const securityMiddleware = (app) => {
    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("CORS not allowed"));
                }
            },
            credentials: true,
        })
    );

    app.use(helmet());
    app.use(mongoSanitize());
    app.use(xss());
    app.use(compression());

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests, please try again later.",
    });
    app.use(limiter);
};