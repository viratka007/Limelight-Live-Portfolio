# Netlify Functions setup (portfolio copy)

These functions are a reviewed starting point for a **separate demo deployment**. They have not been connected to or tested against the production Firebase project. Do not attach this repository to the existing production Netlify site.

## Required environment variables

Set these in the separate Netlify site's environment-variable settings. Never put their values in GitHub:

- `FIREBASE_PROJECT_ID` — ID of the separate demo Firebase project
- `FIREBASE_CLIENT_EMAIL` — service-account client email for that demo project
- `FIREBASE_PRIVATE_KEY` — private key for that demo project's service account; preserve newlines or use `\\n` escapes
- `FIREBASE_DATABASE_URL` — Realtime Database URL for the demo project
- `ALLOWED_ORIGINS` — comma-separated exact origin(s), e.g. `https://YOUR-DEMO-SITE.netlify.app`; include local origins only if needed for local testing
- `LIMELIGHT_MASTER_UID` — UID of the designated master account in the demo project; set this to protect it from deletion

The designated master must have an RTDB profile at `users/{uid}` with `active: true` and `role: "master"`.

## Deploy checklist

1. Create a separate Firebase project and a dedicated service account with only the permissions required for the demo.
2. Configure Firebase Authentication and Realtime Database for that project, then review the database rules.
3. Create a test master account and its `users/{uid}` profile before invoking either function.
4. Set all environment variables above in the separate Netlify site and trigger a fresh deploy after setting them.
5. Test unauthorized requests, expired tokens, invalid input, duplicate emails, create/delete flows, and deletion protection with test accounts only.
6. Confirm the frontend points only to the demo Firebase project and the browser origin matches `ALLOWED_ORIGINS`.

## Important integration note

The frontend expects `/.netlify/functions/create-user` and `/.netlify/functions/delete-user`. These files implement those names. CORS is allowlisted using `ALLOWED_ORIGINS`; an incorrect value will block browser requests. Requests are also authenticated and authorised on the server. CORS is not a substitute for authorization.

These functions have only been statically reviewed and syntax-checked here; they have not been integration-tested against Firebase or Netlify. Review them and run tests before use.
