import { Router } from "express";
import { getCategories } from "../utils/index.js";
import admin from "../config/firebase.js";

const localRoute = Router();

localRoute.post("/getHomePage", async(req, res) => {
    let homePage = {
        categories: [],
        newArrivals: []
    }
    try {
        let cat = await getCategories()
        if (cat[0]) {
            Object.values(cat[1]).forEach(g => {
                homePage.categories.push(g)
            });
        }

        let product = await admin.firestore().collection("products").orderBy("createdAt", "desc").limit(4).get()
        if (!product.empty) {
            product.docs.forEach(d => {
                let newData = d.data()
                newData.id = d.id
                homePage.newArrivals.push(newData)
            })
        }
        res.status(200).json(homePage)
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
    }
})

export default localRoute