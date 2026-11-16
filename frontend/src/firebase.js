// src/firebase.js — Google sign-in popup (Firebase Auth)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey:     import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:      import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isGoogleConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

let auth = null;
const getFirebaseAuth = () => {
  if (!auth) auth = getAuth(initializeApp(firebaseConfig));
  return auth;
};

// Google popup kholo aur backend ke liye ID token wapas do
export const getGoogleIdToken = async () => {
  const firebaseAuth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(firebaseAuth, provider);
  const idToken = await result.user.getIdToken();
  // hamara apna JWT session chalata hai, Firebase session ki zaroorat nahi
  await signOut(firebaseAuth);
  return idToken;
};
