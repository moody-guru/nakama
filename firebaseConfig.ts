import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  Auth,
  // @ts-ignore: This function exists in the RN bundle but is missing from some type definitions
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "###############################################",
  authDomain: "nakama-3ab1c.firebaseapp.com",
  projectId: "nakama-3ab1c",
  storageBucket: "nakama-3ab1c.firebasestorage.app",
  messagingSenderId: "675983940326",
  appId: "1:675983940326:web:6584b4ce6b637fab38f927",
  measurementId: "G-2M9XTWW6CV",
};

// 1. EXPLICIT TYPING: We tell TypeScript exactly what these variables will hold
let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  // First time loading? Initialize properly.
  app = initializeApp(firebaseConfig);

  auth = initializeAuth(app, {
    // @ts-ignore: Silencing the "missing export" error safely
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  // App already running? Reuse the existing instance.
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
