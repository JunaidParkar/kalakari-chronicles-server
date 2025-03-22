import { Router } from "express";
import { getAuth } from "firebase-admin/auth"; // Correct way to import authentication
import admin from "../config/firebase.js";
import { emailVerifyTemplate, transporter } from "../utils/index.js";

const router = Router();

router.post("/register", async(req, res) => {
    try {
        let userDetails = req.body;
        let user = await admin.auth().createUser(userDetails); // No need to pass `admin`
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Unable to register user", error: "Unable to register new account. Please try again later." });
    }
});

router.post("/sendVerification", async(req, res) => {
    let [userDetails, action] = req.body
    console.log(userDetails)
    console.log(action)
    admin.auth().generateEmailVerificationLink(userDetails.email, { url: action.redirectURL, handleCodeInApp: true, }).then(link => {
        transporter.sendMail({
            from: "kalakarichronicles1@gmail.com",
            to: userDetails.email,
            subject: "Verify your Email for kalakari chronicles",
            html: emailVerifyTemplate(link)
        }).then(() => {
            res.status(200).json({ message: "Verification link send successfully to email." })
        }).catch(error => {
            res.status(500).json({ message: "Unable to send the verification link at the moment. Please try again later" })
        })
    }).catch(error => {
        console.log(error)
        res.status(500).json({ message: "Unable to generate verification mail. Please try again later." })
    })
})

export default router;