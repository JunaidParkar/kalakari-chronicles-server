import multer from 'multer';
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BRAVO_EMAIL,
        pass: process.env.BRAVO_PASSWORD,
    },
});

export const emailVerifyTemplate = link => {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email Verification - Kalakari Chronicles</title><style>body {    font-family: Arial, sans-serif;    background-color: #f9f9f9;    margin: 0;    padding: 0;    display: flex;    justify-content: center;    align-items: center;    height: 100vh;}.email-container {    background-color: #ffffff;    border-radius: 10px;    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);    padding: 30px;    max-width: 400px;    text-align: center;}.brand-name {    font-size: 24px;    font-weight: bold;    color: #e91e63;    margin-bottom: 20px;}.message {    font-size: 16px;    color: #333333;    margin-bottom: 20px;}.verify-button {    background-color: #e91e63;    color: #ffffff;    border: none;    border-radius: 5px;    padding: 12px 24px;    font-size: 16px;    cursor: pointer;    transition: background-color 0.3s ease;} .verify-button:hover {background-color: #c2185b;} .footer {margin-top: 20px;font-size: 12px;color: #777777;}</style></head><body><div class="email-container"><div class="brand-name">Kalakari Chronicles</div><div class="message">Thank you for signing up! Please verify your email address to get started.</div><a href=${link} class="verify-button">Verify Your Email</a><div class="footer">If you did not sign up for this account, please ignore this email.</div></div></body></html>`
}

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({ storage });

// await transporter.sendMail({
//     from: "kalakarichronicles1@gmail.com",
//     to: email,
//     subject,
//     html: `<p>${message}</p>`,
// });