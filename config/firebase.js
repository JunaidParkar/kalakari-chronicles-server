import admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import { serviceKey } from "../serviceAccountKey.js"
import { readFileSync } from 'fs'

admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
})

// const db = getFirestore()

export default admin