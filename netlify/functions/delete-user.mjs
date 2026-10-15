import { getFirebaseServices, genericError, jsonResponse, originAllowed, requireActiveMaster } from "./_shared.mjs";

export async function handler(event) {
  const { origin, allowed } = originAllowed(event);
  if (!allowed) return jsonResponse(403, { error: "Origin not allowed." }, origin);
  if (event.httpMethod === "OPTIONS") return jsonResponse(204, {}, origin);
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed." }, origin);

  try {
    const { auth, db } = getFirebaseServices();
    const authorization = await requireActiveMaster(event, auth, db);
    if (authorization.error) {
      return jsonResponse(authorization.error.status, { error: authorization.error.message }, origin);
    }

    let data;
    try { data = JSON.parse(event.body || "{}"); }
    catch { return jsonResponse(400, { error: "Invalid JSON request." }, origin); }

    const uid = String(data.uid || "").trim();
    if (!uid || uid.length > 128 || /[/.#$\[\]]/.test(uid)) {
      return jsonResponse(400, { error: "A valid user UID is required." }, origin);
    }
    if (uid === authorization.decoded.uid || uid === process.env.LIMELIGHT_MASTER_UID) {
      return jsonResponse(400, { error: "The master account cannot be deleted." }, origin);
    }

    const targetProfileSnapshot = await db.ref(`users/${uid}`).once("value");
    const targetProfile = targetProfileSnapshot.val();
    if (targetProfile?.role === "master") {
      return jsonResponse(400, { error: "A master account cannot be deleted through this endpoint." }, origin);
    }

    try {
      await auth.deleteUser(uid);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Continue to remove a stale profile below.
      } else if (error.code === "auth/invalid-uid") {
        return jsonResponse(400, { error: "The selected account UID is invalid." }, origin);
      } else {
        throw error;
      }
    }

    try {
      await db.ref(`users/${uid}`).remove();
    } catch (error) {
      console.error("RTDB profile cleanup failed:", error?.code || "unknown");
      return jsonResponse(200, {
        success: true,
        message: "Authentication account deleted; profile cleanup is pending.",
        profileCleanup: "pending",
      }, origin);
    }

    return jsonResponse(200, {
      success: true,
      message: "Backstage account deleted successfully.",
      profileCleanup: "removed",
    }, origin);
  } catch (error) {
    const failure = genericError(error, "delete-user");
    return jsonResponse(failure.status, failure.body, origin);
  }
}
