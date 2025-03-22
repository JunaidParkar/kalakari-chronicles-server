import express, { json } from "express";
import nodemailer from "nodemailer";
import { config } from "dotenv";

config()
const app = express();
app.use(json());

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BRAVO_EMAIL,
        pass: process.env.BRAVO_PASSWORD,
    },
});

app.post("/send-email", async(req, res) => {
    console.log(req.body)
    const { email, subject, message } = req.body;
    console.log(process.env.BRAVO_API_KEY, email)
    try {
        await transporter.sendMail({
            from: "kalakarichronicles1@gmail.com",
            to: email,
            subject,
            html: `<p>${message}</p>`,
        });

        res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));