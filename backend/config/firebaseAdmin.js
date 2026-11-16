// Firebase Admin — sirf Google sign-in tokens verify karne ke liye
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let auth = null;

const getFirebaseAuth = () => {
  if (auth) return auth;

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    return null; // Google sign-in not configured
  }

  const app = initializeApp({
    credential: cert({
      projectId:   FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      // .env stores the key on one line with literal \n
      privateKey:  FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  auth = getAuth(app);
  return auth;
};

module.exports = { getFirebaseAuth };
