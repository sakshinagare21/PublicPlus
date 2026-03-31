import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyBacHgF_aLvwsNNxkzeoZMw88uKcQExtoo",
 authDomain: "publicplus-b458a.firebaseapp.com",
 projectId: "publicplus-b458a",
 storageBucket: "publicplus-b458a.firebasestorage.app",
 messagingSenderId: "973057675761",
 appId: "1:973057675761:web:a5c54999e36be1d624b450",
 measurementId: "G-SYCVV4BMZR"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

