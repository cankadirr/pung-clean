import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXb3xXCgtz2piREH-arulG5DA_-D0Fvv4",
  authDomain: "pung-clean.firebaseapp.com",
  projectId: "pung-clean",
  storageBucket: "pung-clean.firebasestorage.app",
  messagingSenderId: "737092024953",
  appId: "1:737092024953:web:7ddb2dff7a516a81b0f2a8",
  measurementId: "G-DE4N14FXJH",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);