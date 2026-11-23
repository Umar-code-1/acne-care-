// Cloudflare Pages Function: /__/auth/* ko Firebase ke auth handler tak forward karta hai.
// Is se Google sign-in page hamare apne domain (acne-care.pages.dev) par chalta hai,
// warna mobile browsers (iOS Safari/Chrome) alag domain ka storage block kar dete hain
// aur "missing initial state" error aata hai.
import { proxyToFirebase } from "../_proxy.js";

export const onRequest = (context) => proxyToFirebase(context.request);
