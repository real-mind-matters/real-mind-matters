import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfGckiURaCg7pheJp-3izFM7ETQoY5_GA",
  authDomain: "real-mind-matters.firebaseapp.com",
  projectId: "real-mind-matters",
  storageBucket: "real-mind-matters.firebasestorage.app",
  messagingSenderId: "805995250501",
  appId: "1:805995250501:web:5fb1edc57609c34cb4342c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };


