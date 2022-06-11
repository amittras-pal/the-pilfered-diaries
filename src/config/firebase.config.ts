import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAXhkkrN4nCBl57CM_y5j0TH9_dbmhNlyk",
  authDomain: "the-book-nerd.firebaseapp.com",
  projectId: "the-book-nerd",
  storageBucket: "the-book-nerd.appspot.com",
  messagingSenderId: "1007265574880",
  appId: "1:1007265574880:web:77c97977e51b6cd533c585",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const fireStore = getFirestore(app);
export const storage = getStorage(app);
