import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7wFu2--lzvkaEJKN_5y7y18vu9Mq5QFI",
  authDomain: "oliverkitchen.firebaseapp.com",
  projectId: "oliverkitchen",
  storageBucket: "oliverkitchen.firebasestorage.app",
  messagingSenderId: "1002234409365",
  appId: "1:1002234409365:web:e33743fb68f9df1c14869c",
  measurementId: "G-5DDTHVFCKS"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics ,db};