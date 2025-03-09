import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3mwS1-sOEKcFdXZZ3IyegplUGUMWDokE",
  authDomain: "nutritionistproject.firebaseapp.com",
  projectId: "nutritionistproject",
  storageBucket: "nutritionistproject.appspot.com", // ✅ Fixed storageBucket
  messagingSenderId: "185786070396",
  appId: "1:185786070396:web:71c3572e9689e55095a0f9",
};

// ✅ Ensure Firebase is initialized and always return the app
export const initFirebase = () => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp(); // ✅ Always return the app instance
};

// ✅ Use the initialized app for Firebase services
export const getFirebaseAuth = () => {
  const app = initFirebase();
  return getAuth(app);
};

export const getFirebaseDb = () => {
  const app = initFirebase();
  return getFirestore(app);
};
