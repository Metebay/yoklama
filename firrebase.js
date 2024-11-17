import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDtw3dBVcjhftDX7KqGdpdfAH7rCZuSGM4",
    authDomain: "yoklama-sistss.firebaseapp.com",
    projectId: "yoklama-sistss",
    storageBucket: "yoklama-sistss.firebasestorage.app",
    messagingSenderId: "648200322291",
    appId: "1:648200322291:web:5cbc32a11ca69caeb98b86",
    measurementId: "G-13FDPVPXQW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
