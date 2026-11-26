// src/firebase.js — Google sign-in (Firebase Auth): popup, ya popup block ho to full-page redirect
import { initializeApp } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut,
} from "firebase/auth";

// Live site par sign-in page apne hi domain se chalao (functions/__/auth proxy).
// Alag domain (firebaseapp.com) hone se mobile browsers storage block karte hain
// aur "missing initial state" error aata hai.
const SELF_HOSTED_AUTH_HOSTS = ["acne-care.pages.dev"];
const authDomain = SELF_HOSTED_AUTH_HOSTS.includes(window.location.hostname)
  ? window.location.host
  : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

const firebaseConfig = {
  apiKey:     import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain,
  projectId:  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:      import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isGoogleConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

// Auth ko screen khulte hi tayyar kar lo, click par nahi. Safari popup sirf tab kholne deta hai
// jab wo tap ke foran baad khule — click par Firebase start karne se der hoti thi aur popup block hota tha.
const auth = isGoogleConfigured ? getAuth(initializeApp(firebaseConfig)) : null;

const PENDING_KEY = "googleRedirectPending";

const makeProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
};

// token lo aur Firebase session band karo — hamara apna JWT session chalata hai
const takeIdToken = async (user) => {
  const idToken = await user.getIdToken();
  await signOut(auth);
  return idToken;
};

// Google popup kholo aur backend ke liye ID token wapas do
export const getGoogleIdToken = async () => {
  const result = await signInWithPopup(auth, makeProvider());
  return takeIdToken(result.user);
};

// Popup block ho jaye to poora page Google par bhejo. `pending` (mode, role waghera)
// wapas aane par chahiye, is liye sessionStorage mein rakho.
export const startGoogleRedirect = async (pending) => {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  await signInWithRedirect(auth, makeProvider());
};

// Redirect se wapas aaye hain? To { idToken, pending } do, warna null
export const finishGoogleRedirect = async () => {
  const saved = sessionStorage.getItem(PENDING_KEY);
  if (!auth || !saved) return null;
  sessionStorage.removeItem(PENDING_KEY);
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return { idToken: await takeIdToken(result.user), pending: JSON.parse(saved) };
};

export const hasPendingGoogleRedirect = () => Boolean(sessionStorage.getItem(PENDING_KEY));
