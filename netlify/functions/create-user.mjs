import admin from "firebase-admin";
import { getFirebaseServices, genericError, jsonResponse, originAllowed, requireActiveMaster } from "./_shared.mjs";

export async function handler(event) {
  const { origin, allowed } = originAllowed(event);
  if (!allowed) return jsonResponse(403, { error: "Origin not allowed." }, origin);
  if (event.httpMethod === "OPTIONS") return jsonResponse(204, {}, origin);
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed." }, origin);

  let auth;
  let db;
  try {
    ({ auth, db } = getFirebaseServices());
    const authorization = await requireActiveMaster(event, auth, db);
    if (authorization.error) {
      return jsonResponse(authorization.error.status, { error: authorization.error.message }, origin);
    }

    let data;
    try { data = JSON.parse(event.body || "{}"); }
    catch { return jsonResponse(400, { error: "Invalid JSON request." }, origin); }

    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "");
    const role = String(data.role || "").trim().toLowerCase();
    const active = data.active !== false;

    if (!email || !password || !role) return jsonResponse(400, { error: "Email, password and role are required." }, origin);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonResponse(400, { error: "Enter a valid email address." }, origin);
    if (!["admin", "editor", "viewer"].includes(role)) return jsonResponse(400, { error: "Invalid backstage role." }, origin);
    if (password.length < 6) return jsonResponse(400, { error: "Password must contain at least 6 characters." }, origin);
    if (password.length > 128) return jsonResponse(400, { error: "Password is too long." }, origin);

    let newUser;
    try {
      newUser = await auth.createUser({ email, password, emailVerified: false, disabled: !active });
    } catch (error) {
      if (error.code === "auth/email-already-exists") return jsonResponse(409, { error: "An account with this email already exists." }, origin);
      if (error.code === "auth/invalid-email") return jsonResponse(400, { error: "Enter a valid email address." }, origin);
      if (error.code === "auth/weak-password" || error.code === "auth/password-does-not-meet-requirements") return jsonResponse(400, { error: "The password does not meet Firebase requirements." }, origin);
      throw error;
    }

    try {
      await db.ref(`users/${newUser.uid}`).set({
        email, role, active,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        createdBy: authorization.decoded.uid,
      });
    } catch (error) {
      try { await auth.deleteUser(newUser.uid); }
      catch (cleanupError) { console.error("Account rollback failed:", cleanupError?.code || "unknown"); }
      throw error;
    }

    return jsonResponse(201, {
      success: true,
      message: "Backstage account created successfully.",
      user: { uid: newUser.uid, email, role, active },
    }, origin);
  } catch (error) {
    const failure = genericError(error, "create-user");
    return jsonResponse(failure.status, failure.body, origin);
  }
}
