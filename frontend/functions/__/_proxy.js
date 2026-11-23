// Firebase project ka default auth host
const FIREBASE_AUTH_HOST = "acnecare-ai-3e145.firebaseapp.com";

export const proxyToFirebase = async (request) => {
  const url = new URL(request.url);
  url.hostname = FIREBASE_AUTH_HOST;
  url.port = "";
  url.protocol = "https:";

  const upstream = await fetch(new Request(url, request), { redirect: "manual" });
  return new Response(upstream.body, upstream);
};
