// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableMultiTabIndexedDbPersistence, enableIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHvjBrPbiml1qAAzpvo4lxXphouXm5C-M",
  authDomain: "mediamgjmonde-bb135.firebaseapp.com",
  databaseURL: "https://mediamgjmonde-bb135-default-rtdb.firebaseio.com",
  projectId: "mediamgjmonde-bb135",
  storageBucket: "mediamgjmonde-bb135.firebasestorage.app",
  messagingSenderId: "868803392042",
  appId: "1:868803392042:web:a0dc62d046cfd3b1d48953",
  measurementId: "G-3S2M1Q2DC5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline IndexedDB persistence with automatic sync upon internet reconnection
try {
  enableMultiTabIndexedDbPersistence(db).catch(() => {
    enableIndexedDbPersistence(db).catch(() => {});
  });
} catch (e) {
  // Safe catch for environments not supporting IndexedDB
}

// Initialize Analytics safely (only in supported browser environments)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(() => {
  // Ignore analytics initialization errors offline or inside webview
});
