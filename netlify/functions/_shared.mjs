import admin from "firebase-admin";

const DATABASE_URL = process.env.FIREBASE_DATABASE_URL;

export function jsonResponse(statusCode, body, origin = "") {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (origin && allowedOrigins.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return { statusCode, headers, body: statusCode === 204 ? "" : JSON.stringify(body) };
}

export function originAllowed(event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  // Browser requests with an Origin must match the explicit allowlist.
  // Requests without Origin are still protected by Firebase token checks.
  return { origin, allowed: !origin || allowedOrigins.includes(origin) };
}

export function getFirebaseServices() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey || !DATABASE_URL) {
    const err = new Error("Server configuration is incomplete.");
    err.code = "config/missing-env";
    throw err;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
      databaseURL: DATABASE_URL,
    });
  }
  return { auth: admin.auth(), db: admin.database() };
}

export async function requireActiveMaster(event, auth, db) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return { error: { status: 401, message: "Authentication required." } };
  }

  let decoded;
  try {
    decoded = await auth.verifyIdToken(authHeader.slice(7), true);
  } catch {
    return { error: { status: 401, message: "Invalid or expired authentication token." } };
  }

  const snapshot = await db.ref(`users/${decoded.uid}`).once("value");
  const profile = snapshot.val();
  if (!profile || profile.active !== true || profile.role !== "master") {
    return { error: { status: 403, message: "Master permission required." } };
  }
  return { decoded, profile };
}

export function genericError(error, functionName) {
  // Detailed errors belong in trusted function logs, never in the HTTP response.
  console.error(`${functionName} failed:`, error?.code || "unknown", error?.message || "No message");
  if (error?.code === "config/missing-env") {
    return { status: 500, body: { error: "Server configuration is incomplete." } };
  }
  return { status: 500, body: { error: "The request could not be completed." } };
}
