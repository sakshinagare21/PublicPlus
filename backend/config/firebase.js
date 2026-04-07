// import admin from "firebase-admin";
// import fs from "fs";

// const serviceAccount = JSON.parse(
//  fs.readFileSync(new URL("./firebaseServiceKey.json", import.meta.url))
// );

// admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount),
// });

// console.log("Firebase initialized");

// export default admin;
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import admin from "firebase-admin";

const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
console.log("firebase initialization")

export default admin;