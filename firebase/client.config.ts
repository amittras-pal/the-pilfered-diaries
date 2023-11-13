import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  // databaseURL: "", // Not available in the firebase console config page.
  // measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID, // optional in SDK v7.20.0+
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
});

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
